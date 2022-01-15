require("dotenv").config();

const {
	pluginPrismic,
	definePrismicPluginOptions,
} = require("eleventy-plugin-prismic");

const linkResolver = require("./src/_assets/js/linkResolver");
const discogs = require("./src/_assets/js/discogs");

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

	// Discogs
	const discogsCollection = discogs.getCollection(
		process.env.DISCOGS_USER,
		process.env.DISCOGS_KEY,
		process.env.DISCOGS_SECRET,
	);
	eleventyConfig.addGlobalData("discogs", () => discogsCollection);

	// Ignore functions directory
	eleventyConfig.ignores.add("src/_functions");

	// Base config
	eleventyConfig.setUseGitIgnore(false);
	eleventyConfig.setQuietMode(false);

	// Match Vite's expectations
	eleventyConfig.addPassthroughCopy({ "src/_static": "public" });
	eleventyConfig.addPassthroughCopy({ "src/_assets/css": "assets/css" });
	eleventyConfig.addPassthroughCopy({ "src/_assets/js": "assets/js" });

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
