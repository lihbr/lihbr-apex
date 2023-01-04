require("dotenv").config();

const {
	pluginPrismic,
	definePrismicPluginOptions,
} = require("eleventy-plugin-prismic");

const {
	prismicLinkResolver,
	prismicHTMLSerializer,
	pluginNetlify,
	pluginDiscogs,
	pluginLayoutBlock,
	pluginFilters,
	pluginShortcodes,
} = require("./dist/helpers/index.cjs");

const prismicPluginOptions = definePrismicPluginOptions({
	endpoint: process.env.PRISMIC_ENDPOINT,
	clientConfig: {
		accessToken: process.env.PRISMIC_TOKEN,
	},
	linkResolver: prismicLinkResolver,
	htmlSerializer: prismicHTMLSerializer,
	documentTypes: [
		"post__document",
		"post__art",
		"post__blog",
		"taxonomy__color",
		"taxonomy__category",
	],
	preview: {
		name: "preview",
		functionsDir: "src/_functions",
		copy: ["dist/helpers", ".cache"],
		redirects: false,
	},
});

const config = function (eleventyConfig) {
	// Prismic
	eleventyConfig.addPlugin(pluginPrismic, prismicPluginOptions);

	// Netlify
	eleventyConfig.addPlugin(pluginNetlify, {});

	// Discogs
	eleventyConfig.addPlugin(pluginDiscogs, {
		user: process.env.DISCOGS_USER,
		key: process.env.DISCOGS_KEY,
		secret: process.env.DISCOGS_SECRET,
	});

	// Layout blocks
	eleventyConfig.addPlugin(pluginLayoutBlock);

	// Filters
	eleventyConfig.addPlugin(pluginFilters);

	// Shortcodes
	eleventyConfig.addPlugin(pluginShortcodes);

	// Ignore functions directory
	eleventyConfig.ignores.add("src/_functions");

	// Base config
	eleventyConfig.setUseGitIgnore(false);
	eleventyConfig.setQuietMode(false);

	// Match Vite's expectations
	eleventyConfig.addPassthroughCopy({ "src/_static": "public" });
	eleventyConfig.addPassthroughCopy({ "src/_assets": "assets" });

	// Vite script entry point
	eleventyConfig.addShortcode("script", (rawName) => {
		const name = process.env.ELENVETY_SERVERLESS
			? rawName.replace(/\.ts$/i, ".js")
			: rawName;

		return `<script type="module" src="${name}"></script>`;
	});

	return {
		dir: {
			input: "src",
			output: "dist/11ty",

			includes: "_includes",
			layouts: "_layouts",
			data: "../data",
		},
		templateFormats: ["njk", "md"],
		pathPrefix: "/",
	};
};
config.prismicPluginOptions = prismicPluginOptions;

module.exports = config;
