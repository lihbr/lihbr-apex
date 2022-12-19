import { slugify } from "../lib/slufigy";

import { EleventyConfig } from "../types";

export type FiltersPluginOptions = never;

export const pluginFilters = (
	eleventyConfig: EleventyConfig,
	_options: FiltersPluginOptions,
): void => {
	eleventyConfig.addFilter("slugify", function (value) {
		return slugify(value);
	});
};
