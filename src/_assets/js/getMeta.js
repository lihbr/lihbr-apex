const { getFinalDeployUrl } = require("@lihbr/utils-netlify.ci");
const { asText, asLink } = require("@prismicio/helpers");
const escapeHTML = require("escape-html");

const linkResolver = require("./linkResolver");

const TITLE_LIMIT = 50;
const DESCRIPTION_LIMIT = 155;

/**
 * Cap a string to a given number of characters correctly
 * @param {string} string - string to work on
 * @param {number} limit - max number of characters
 * @return {string} - capped string
 */
const limitLength = (string = "", limit = -1) => {
	let sanitizedString = string.trim();
	if (limit > 0 && sanitizedString.length > limit) {
		sanitizedString = sanitizedString.slice(0, limit);
		sanitizedString = sanitizedString.slice(
			0,
			sanitizedString.lastIndexOf(" "),
		);
		sanitizedString = `${sanitizedString}...`;
	}

	return sanitizedString;
};

const getSiteURL = () => {
	return (
		getFinalDeployUrl({ branchDomains: ["staging", "eleventy"] }) ||
		process.env.APP_URL
	);
};

const getSiteInfo = (settings) => {
	return {
		lang: settings?.data?.site_language || "en",
		// https://regex101.com/r/7ypPr3/1
		domain: getSiteURL().replace(/^https?:\/\/(.*)\/.*$/i, "$1"),
		url: getSiteURL(),
		name: asText(settings?.data?.site_title || []) || "unknown",
		twitterHandle: settings?.data?.site_twitter_handle || "unknown",
		mainAuthor: settings?.data?.site_main_author || "unknown",
		backgroundColor: settings?.data?.site_background_color || "#fefefe",
		accentColor: settings?.data?.site_accent_color || "#111111",
		image: {
			openGraph: settings?.data?.site_image?.url || "",
			twitter: settings?.data?.site_image?.twitterVariant?.url || "",
		},
	};
};

const getPageURL = (document) => {
	return `${getSiteURL()}${asLink(document, linkResolver)}`.replace(/\/$/, "");
};

const getMetaTitle = (document, settings) => {
	const format = settings?.data?.title_format || "%page% - %site%";
	const siteTitle = asText(settings?.data?.site_title) || "unknown";
	const pageTitle =
		document?.data?.meta_title && document.data.meta_title.trim()
			? document.data.meta_title
			: "💐";

	return format
		.replace("%site%", siteTitle)
		.replace("%page%", limitLength(pageTitle, TITLE_LIMIT));
};

const getMetaDescription = (document, settings) => {
	if (
		document?.data?.meta_description &&
		document.data.meta_description.trim()
	) {
		return limitLength(document.data.meta_description, DESCRIPTION_LIMIT);
	} else {
		return limitLength(settings?.data?.site_description) || "unknown";
	}
};

const getMetaImage = (document, settings) => {
	return {
		openGraph:
			document?.data?.meta_image?.url || settings?.data?.site_image?.url || "",
		twitter:
			document?.data?.meta_image?.twitter_variant?.url ||
			settings?.data?.site_image?.twitter_variant?.url ||
			"",
	};
};

const getStructuredData = (document, settings) => {
	const siteTitle = asText(settings?.data?.site_title) || "unknown";
	const pageTitle =
		document?.data?.meta_title && document.data.meta_title.trim()
			? document.data.meta_title
			: "💐";

	return [
		{
			"@context": "http://schema.org",
			"@type": "WebSite",
			url: escapeHTML(getPageURL(document)),
			name: escapeHTML(pageTitle),
			alternateName: escapeHTML(siteTitle),
		},
	];
};

module.exports = {
	getSiteURL,
	getSiteInfo,
	getPageURL,
	getMetaTitle,
	getMetaDescription,
	getMetaImage,
	getStructuredData,
};
