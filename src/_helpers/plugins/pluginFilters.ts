import { slugify } from "../lib/slufigy";

import type { EleventyConfig } from "../types";

export type FiltersPluginOptions = never;

export const pluginFilters = (
	eleventyConfig: EleventyConfig,
	_options: FiltersPluginOptions,
): void => {
	eleventyConfig.addFilter("slugify", function (value) {
		return slugify(value);
	});

	eleventyConfig.addFilter(
		"contrastRatio",
		function (foreground, background: string, precision = 2) {
			/** @see https://www.w3.org/TR/WCAG20/#relativeluminancedef */
			const getRelativeLuminance = (hex: string): number => {
				const maybeMatch = hex.match(/^#(?<r>\w{2})(?<g>\w{2})(?<b>\w{2})$/);

				if (!maybeMatch || !maybeMatch.groups) {
					throw new Error(
						`Provided value is not a valid HEX color string: \`${hex}\``,
					);
				}

				const r8 = parseInt(maybeMatch.groups.r, 16);
				const g8 = parseInt(maybeMatch.groups.g, 16);
				const b8 = parseInt(maybeMatch.groups.b, 16);

				const tweak = (value: number): number => {
					const sRGB = value / 255;

					if (sRGB <= 0.03928) {
						return sRGB / 12.92;
					} else {
						return ((sRGB + 0.055) / 1.055) ** 2.4;
					}
				};

				return 0.2126 * tweak(r8) + 0.7152 * tweak(g8) + 0.0722 * tweak(b8);
			};

			/** @see https://www.w3.org/TR/WCAG20/#contrast-ratiodef */
			const getContrastRatio = (l1: number, l2: number): number => {
				if (l1 > l2) {
					return (l1 + 0.05) / (l2 + 0.05);
				} else {
					return (l2 + 0.05) / (l1 + 0.05);
				}
			};

			return getContrastRatio(
				getRelativeLuminance(foreground),
				getRelativeLuminance(background),
			)
				.toFixed(precision)
				.replace(/\.?0+$/, "");
		},
	);
};
