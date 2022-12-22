import * as prismic from "@prismicio/client";

import { highlightCode, parseMarkdownCodeBlock } from "../lib/highlightCode";
import { htmlSerializer } from "../prismic/htmlSerializer";
import { linkResolver } from "../prismic/linkResolver";
import type { EleventyConfig } from "../types";

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
					prismic: {
						taxonomy__color: prismic.PrismicDocument<{
							name: prismic.TitleField;
						}>[];
					};
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

			return prismic.asText(color.data.name).toLowerCase();
		},
	);

	eleventyConfig.addShortcode(
		"resolveCategory",
		function (
			this: {
				ctx: {
					prismic: {
						taxonomy__category: prismic.PrismicDocument<{
							name: prismic.TitleField;
						}>[];
					};
				};
			},
			categories: prismic.GroupField<{
				category?: prismic.ContentRelationshipField<
					string,
					string,
					{ name: prismic.TitleField }
				>;
			}>,
		) {
			if (
				!prismic.isFilled.group(categories) ||
				!prismic.isFilled.contentRelationship(categories[0].category)
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

			return prismic.asText(category.data.name);
		},
	);

	eleventyConfig.addAsyncShortcode(
		"asyncAsHTML",
		async (richText: prismic.RichTextField) => {
			// Prepare nodes
			const prepared = (await Promise.all<prismic.RTNode>(
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
			)) as unknown as prismic.RichTextField;

			return prismic.asHTML(prepared, linkResolver, htmlSerializer);
		},
	);
};
