import slufigy from "slugify";

import { EleventyConfig } from "../types";

export type FiltersPluginOptions = never;

export const pluginFilters = (
	eleventyConfig: EleventyConfig,
	_options: FiltersPluginOptions,
): void => {
	eleventyConfig.addFilter("slugify", function (value) {
		return slufigy(value, {
			replacement: "-",
			remove: /[*+~()`'"!?:;,.@°_]/g,
			lower: true,
		});
	});
};
