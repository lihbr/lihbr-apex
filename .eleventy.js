require("dotenv").config();

const htmlmin = require("html-minifier");
const { pluginPrismic } = require("eleventy-plugin-prismic");

const linkResolver = require("./src/_assets/js/linkResolver");

module.exports = function (eleventyConfig) {
	// Prismic

	/**
	 * @type {import("eleventy-plugin-prismic").PrismicPluginOptions}
	 */
	const prismicPluginOptions = {
		endpoint: process.env.PRISMIC_ENDPOINT,
		clientConfig: {
			accessToken: process.env.PRISMIC_TOKEN,
		},
		linkResolver,
		singletons: ["settings", "settings__pages"],
	};

	eleventyConfig.addPlugin(pluginPrismic, prismicPluginOptions);

	// Minify HTML
	eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
		if (outputPath && /\.(html|xml)$/i.test(outputPath)) {
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
	// eleventyConfig.addWatchTarget("./src/_assets/");
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
		templateFormats: ["njk", "md"],
		pathPrefix: "/",
	};
};
