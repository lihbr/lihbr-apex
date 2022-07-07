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
			prismic: { settings },
			page,
			meta = {
				title: "",
				description: "",
			},
		}) => {
			if (!doc) {
				// Mock Prismic document
				doc = {
					url: page.url,
					slugs: [],
					data: {
						meta_title: meta?.title ?? "",
						meta_description: meta?.description ?? "",
					},
				};
			}

			return {
				site: getSiteInfo(settings),
				url: getPageURL(doc),
				title: getMetaTitle(settings, doc),
				description: getMetaDescription(settings, doc),
				image: getMetaImage(settings, doc),
				structuredData: JSON.stringify(getStructuredData(settings, doc)),
			};
		},
	),
};
