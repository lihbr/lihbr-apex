import {
	asText,
	asHTML,
	isFilled,
	PrismicDocument,
	TitleField,
	RichTextField,
	RTNode,
	GroupField,
	ContentRelationshipField,
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

	eleventyConfig.addShortcode(
		"resolveCategory",
		function (
			this: {
				ctx: {
					prismic: {
						taxonomy__category: PrismicDocument<{ name: TitleField }>[];
					};
				};
			},
			categories: GroupField<{
				category?: ContentRelationshipField<
					string,
					string,
					{ name: TitleField }
				>;
			}>,
		) {
			if (
				!isFilled.group(categories) ||
				!isFilled.contentRelationship(categories[0].category)
			) {
				return "Miscellaneous";
			}

			const categoryID = categories[0].category.id;

			const category = this.ctx.prismic.taxonomy__category.find(
				(category) => category.id === categoryID,
			);

			if (!category) {
				throw new Error("Category could not be resolved");
			}

			return asText(category.data.name);
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
