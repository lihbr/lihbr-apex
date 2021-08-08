require("dotenv").config();

const htmlmin = require("html-minifier");
const pluginPrismic = require("eleventy-plugin-prismic");

module.exports = function (eleventyConfig) {
	// Prismic

	/**
	 * @type {import("eleventy-plugin-prismic/src/types").PrismicPluginOptions}
	 */
	const prismicPluginOptions = {
		client: [
			process.env.PRISMIC_ENDPOINT,
			{ accessToken: process.env.PRISMIC_TOKEN },
		],
	};

	eleventyConfig.addPlugin(pluginPrismic, prismicPluginOptions);

	// Minify HTML
	eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
		if (outputPath && outputPath.endsWith(".html")) {
			return htmlmin.minify(content, {
				useShortDoctype: true,
				removeComments: true,
				collapseWhitespace: true,
			});
		} else {
			return content;
		}
	});

	// Ignore functions directory
	eleventyConfig.ignores.add("src/_functions");

	// Watch assets
	eleventyConfig.setUseGitIgnore(false);
	eleventyConfig.addWatchTarget("./src/assets/");
	eleventyConfig.addWatchTarget("./tailwind.config.js");

	// Base config
	eleventyConfig.setQuietMode(false);
	eleventyConfig.addPassthroughCopy({ "src/_static": "." });

	return {
		dir: {
			input: "src",
			output: "dist",

			includes: "_includes",
			layouts: "_layouts",
			_data: "_data",
		},
		templateFormats: ["njk"],
		pathPrefix: "/",
	};
};
