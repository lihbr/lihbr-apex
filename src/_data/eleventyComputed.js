const logErrors = require("../_lib/logErrors");
const {
	getSiteInfo,
	getPageURL,
	getMetaTitle,
	getMetaDescription,
	getMetaImage,
	getStructuredData,
} = require("../_lib/getMeta");

module.exports = {
	meta: logErrors(({ document, prismic: { settings } }) => {
		if (!document) {
			return {
				site: getSiteInfo(settings),
			};
		} else {
			return {
				site: getSiteInfo(settings),
				url: getPageURL(document),
				title: getMetaTitle(document, settings),
				description: getMetaDescription(document, settings),
				image: getMetaImage(document, settings),
				structuredData: JSON.stringify(getStructuredData(document, settings)),
			};
		}
	}),
};
