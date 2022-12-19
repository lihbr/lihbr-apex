import escapeHTML from "escape-html";
import { asLink, PrismicDocument } from "@prismicio/client";

import { getFinalDeployURL } from "./lib/getFinalDeployURL";
import { linkResolver } from "./prismic";

const SITE_LANG = "en";
const SITE_TITLE = "lihbr";
const SITE_DESCRIPTION =
	"Lucie's place on the internet to share things with friends, students, and digital people.";
const SITE_TWITTER_HANDLE = "li_hbr";
const SITE_MAIN_AUTHOR = "Lucie Haberer";
const SITE_BACKGROUND_COLOR = "#fff7f7";
const SITE_ACCENT_COLOR = "#e84311";
const SITE_META_IMAGE = {
	openGraph:
		"https://images.prismic.io/lihbr/e524336e-aebe-41c1-a158-0cf957139e6a_lihbr-apex--1.91_1.png?auto=compress,format",
	twitter:
		"https://images.prismic.io/lihbr/e524336e-aebe-41c1-a158-0cf957139e6a_lihbr-apex--1.91_1.png?auto=compress,format",
} as const;
const SITE_TITLE_FORMAT = "%page% - %site%";
const PAGE_DEFAULT_TITLE = "💐";

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
	const maybeDeployURL = getFinalDeployURL({
		branchDomains: ["staging", "eleventy"],
	});

	if (maybeDeployURL) {
		return maybeDeployURL;
	}

	if (process.env.APP_URL) {
		return process.env.APP_URL;
	}

	throw new Error("Could not resolve site URL");
};

export const getSiteInfo = (): {
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
		lang: SITE_LANG,
		domain: new URL(getSiteURL()).host,
		url: getSiteURL(),
		name: SITE_TITLE,
		twitterHandle: SITE_TWITTER_HANDLE,
		mainAuthor: SITE_MAIN_AUTHOR,
		backgroundColor: SITE_BACKGROUND_COLOR,
		accentColor: SITE_ACCENT_COLOR,
		image: SITE_META_IMAGE,
	};
};

export const getPageURL = (doc: PrismicDocument): string => {
	return `${getSiteURL()}${asLink(doc, linkResolver)}`.replace(/\/$/, "");
};

export const getMetaTitle = (doc: PrismicDocument): string => {
	return SITE_TITLE_FORMAT.replace("%site%", SITE_TITLE).replace(
		"%page%",
		limitLength(doc.data.meta_title || PAGE_DEFAULT_TITLE, TITLE_LIMIT),
	);
};

export const getMetaDescription = (doc: PrismicDocument): string => {
	return limitLength(
		doc.data.meta_description || SITE_DESCRIPTION,
		DESCRIPTION_LIMIT,
	);
};

export const getMetaImage = (
	doc: PrismicDocument,
): {
	openGraph: string;
	twitter: string;
} => {
	return {
		openGraph: doc.data.meta_image?.url || SITE_META_IMAGE.openGraph,
		twitter:
			doc.data.meta_image?.twitter_variant?.url || SITE_META_IMAGE.twitter,
	};
};

export const getStructuredData = (
	doc: PrismicDocument,
): Record<string, string>[] => {
	return [
		{
			"@context": "http://schema.org",
			"@type": "WebSite",
			url: escapeHTML(getPageURL(doc)),
			name: escapeHTML(doc.data.meta_title || PAGE_DEFAULT_TITLE),
			alternateName: escapeHTML(SITE_TITLE),
		},
	];
};
