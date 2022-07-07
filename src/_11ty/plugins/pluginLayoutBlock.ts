import { EleventyConfig } from "../types";

export type LayoutBlockPluginOptions = never;

export const pluginLayoutBlock = (
	eleventyConfig: EleventyConfig,
	_options: LayoutBlockPluginOptions,
): void => {
	const map: Record<string, Record<string, string>> = {};

	eleventyConfig.addPairedShortcode(
		"renderLayoutBlock",
		(content, page, name) => {
			return (map[page.url] || {})[name] || content;
		},
	);

	eleventyConfig.addPairedShortcode("layoutBlock", (content, page, name) => {
		map[page.url] ||= {};
		map[page.url][name] = content;

		return "";
	});
};
