const {
	logErrors,
	getSiteInfo,
	getPageURL,
	getMetaTitle,
	getMetaDescription,
	getMetaImage,
	getStructuredData,
} = require("../../dist/helpers/index.cjs");

module.exports = {
	meta: logErrors(
		({
			doc,
			page,
			meta = {
				title: "",
				description: "",
			},
		}) => {
			if (!doc) {
				// Mock Prismic document
				doc = {
					type: "__eleventy",
					url: page.url,
					slugs: [],
					data: {
						meta_title: meta?.title ?? "",
						meta_description: meta?.description ?? "",
					},
				};
			}

			return {
				site: getSiteInfo(),
				url: getPageURL(doc),
				title: getMetaTitle(doc),
				description: getMetaDescription(doc),
				image: getMetaImage(doc),
				structuredData: JSON.stringify(getStructuredData(doc)),
			};
		},
	),
};
