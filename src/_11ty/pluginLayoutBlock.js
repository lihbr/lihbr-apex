const pluginLayoutBlock = (eleventyConfig) => {
	const map = {};

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
exports.pluginLayoutBlock = pluginLayoutBlock;
