import escapeHTML from "escape-html";
import { asText, asLink, isFilled, PrismicDocument } from "@prismicio/client";

// @ts-expect-error ci doesn't provide TypeScript definitions
import { getFinalDeployUrl } from "@lihbr/utils-netlify.ci";

import { linkResolver } from "./prismic";

const TITLE_LIMIT = 50;
const DESCRIPTION_LIMIT = 155;

/**
 * Cap a string to a given number of characters correctly
 */
const limitLength = (string = "", limit = -1): string => {
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

export const getSiteURL = (): string => {
	return (
		getFinalDeployUrl({ branchDomains: ["staging", "eleventy"] }) ||
		process.env.APP_URL
	);
};

export const getSiteInfo = (
	settings: PrismicDocument,
): {
	lang: string;
	domain: string;
	url: string;
	name: string;
	twitterHandle: string;
	mainAuthor: string;
	backgroundColor: string;
	accentColor: string;
	image: {
		openGraph: string;
		twitter: string;
	};
} => {
	return {
		lang: settings.data.site_language || "en",
		domain: new URL(getSiteURL()).host,
		url: getSiteURL(),
		name: asText(settings.data.site_title || []) || "unknown",
		twitterHandle: settings.data.site_twitter_handle || "unknown",
		mainAuthor: settings.data.site_main_author || "unknown",
		backgroundColor: settings.data.site_background_color || "#ffffff",
		accentColor: settings.data.site_accent_color || "#000000",
		image: getMetaImage(settings),
	};
};

export const getPageURL = (doc: PrismicDocument): string => {
	return `${getSiteURL()}${asLink(doc, linkResolver)}`.replace(/\/$/, "");
};

export const getMetaTitle = (
	settings: PrismicDocument,
	doc?: PrismicDocument,
): string => {
	const format = settings.data.title_format || "%page% - %site%";
	const siteTitle = asText(settings.data.site_title) || "unknown";
	const pageTitle =
		doc && isFilled.keyText(doc.data.meta_title) ? doc.data.meta_title : "💐";

	return format
		.replace("%site%", siteTitle)
		.replace("%page%", limitLength(pageTitle, TITLE_LIMIT));
};

export const getMetaDescription = (
	settings: PrismicDocument,
	doc?: PrismicDocument,
): string => {
	if (doc && isFilled.keyText(doc.data.meta_description)) {
		return limitLength(doc.data.meta_description, DESCRIPTION_LIMIT);
	} else {
		return limitLength(settings.data.site_description) || "unknown";
	}
};

export const getMetaImage = (
	settings: PrismicDocument,
	doc?: PrismicDocument,
): {
	openGraph: string;
	twitter: string;
} => {
	return {
		openGraph: doc?.data.meta_image?.url || settings.data.site_image?.url || "",
		twitter:
			doc?.data.meta_image?.twitter_variant?.url ||
			settings.data.site_image?.twitter_variant?.url ||
			"",
	};
};

export const getStructuredData = (
	settings: PrismicDocument,
	doc: PrismicDocument,
): Record<string, string>[] => {
	const siteTitle = asText(settings.data.site_title) || "unknown";
	const pageTitle = isFilled.keyText(doc.data.meta_title)
		? doc.data.meta_title
		: "💐";

	return [
		{
			"@context": "http://schema.org",
			"@type": "WebSite",
			url: escapeHTML(getPageURL(doc)),
			name: escapeHTML(pageTitle),
			alternateName: escapeHTML(siteTitle),
		},
	];
};
