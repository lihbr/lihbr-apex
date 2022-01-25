const logErrors = require("../_11ty/logErrors");
const {
	getSiteInfo,
	getPageURL,
	getMetaTitle,
	getMetaDescription,
	getMetaImage,
	getStructuredData,
} = require("../_11ty/getMeta");

module.exports = {
	meta: logErrors(
		({
			document,
			prismic: { settings },
			page,
			meta = {
				title: "",
				description: "",
			},
		}) => {
			if (!document) {
				// Mock Prismic document
				document = {
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
				url: getPageURL(document),
				title: getMetaTitle(document, settings),
				description: getMetaDescription(document, settings),
				image: getMetaImage(document, settings),
				structuredData: JSON.stringify(getStructuredData(document, settings)),
			};
		},
	),
};
