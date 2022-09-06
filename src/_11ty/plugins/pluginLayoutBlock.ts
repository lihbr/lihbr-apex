import { EleventyConfig } from "../types";

export type LayoutBlockPluginOptions = never;

const extractPage = (
	thisArg:
		| {
				page?: Record<string, string>;
		  }
		| unknown,
): Record<string, string> => {
	const page =
		thisArg && typeof thisArg === "object" && "page" in thisArg
			? (
					thisArg as {
						page?: Record<string, string>;
					}
			  ).page
			: undefined;

	if (page) {
		return page;
	} else {
		throw new Error("`page` is not available on `this`");
	}
};

export const pluginLayoutBlock = (
	eleventyConfig: EleventyConfig,
	_options: LayoutBlockPluginOptions,
): void => {
	const map: Record<string, Record<string, string>> = {};

	eleventyConfig.addPairedShortcode(
		"renderLayoutBlock",
		function (
			this:
				| {
						page?: Record<string, string>;
				  }
				| unknown,
			content,
			name,
		) {
			const page = extractPage(this);

			return (map[page.url] || {})[name] || content;
		},
	);

	eleventyConfig.addPairedShortcode(
		"layoutBlock",
		function (
			this:
				| {
						page?: Record<string, string>;
				  }
				| unknown,
			content,
			name,
		) {
			const page = extractPage(this);

			map[page.url] ||= {};
			map[page.url][name] = content;

			return "";
		},
	);
};
