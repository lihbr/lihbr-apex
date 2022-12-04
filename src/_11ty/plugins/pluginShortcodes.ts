import {
	asText,
	asHTML,
	PrismicDocument,
	TitleField,
	RichTextField,
	RTNode,
} from "@prismicio/client";

import { parseMarkdownCodeBlock, highlightCode } from "../lib/highlightCode";
import { htmlSerializer, linkResolver } from "../prismic";
import { EleventyConfig } from "../types";

export type ShortcodesPluginOptions = never;

export const pluginShortcodes = (
	eleventyConfig: EleventyConfig,
	_options: ShortcodesPluginOptions,
): void => {
	eleventyConfig.addShortcode(
		"resolveTheme",
		function (
			this: {
				ctx: {
					prismic: { taxonomy__color: PrismicDocument<{ name: TitleField }>[] };
				};
			},
			theme: { id: string },
		) {
			const color = this.ctx.prismic.taxonomy__color.find(
				(color) => color.id === theme.id,
			);

			if (!color) {
				throw new Error("Theme could not be resolved");
			}

			return asText(color.data.name).toLowerCase();
		},
	);

	eleventyConfig.addAsyncShortcode(
		"asyncAsHTML",
		async (richText: RichTextField) => {
			// Prepare nodes
			const prepared = (await Promise.all<RTNode>(
				richText.map((node) => {
					switch (node.type) {
						case "preformatted":
							return (async () => {
								return {
									...node,
									text: await highlightCode(parseMarkdownCodeBlock(node.text)),
								};
							})();

						default:
							return node;
					}
				}),
			)) as unknown as RichTextField;

			return asHTML(prepared, linkResolver, htmlSerializer);
		},
	);
};
