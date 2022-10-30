import { asText, PrismicDocument, TitleField } from "@prismicio/client";

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
};
