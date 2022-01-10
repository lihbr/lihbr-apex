require("dotenv").config();

const htmlmin = require("html-minifier");
const {
	pluginPrismic,
	definePrismicPluginOptions,
} = require("eleventy-plugin-prismic");

const linkResolver = require("./src/_assets/js/linkResolver");

const prismicPluginOptions = definePrismicPluginOptions({
	endpoint: process.env.PRISMIC_ENDPOINT,
	clientConfig: {
		accessToken: process.env.PRISMIC_TOKEN,
	},
	linkResolver,
	singletons: ["settings", "settings__pages"],
	preview: {
		name: "preview",
		functionsDir: "src/_functions",
		copy: ["src/_assets"],
	},
});

const config = function (eleventyConfig) {
	// Prismic
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

	// Base config
	eleventyConfig.setUseGitIgnore(false);
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
config.prismicPluginOptions = prismicPluginOptions;

module.exports = config;
