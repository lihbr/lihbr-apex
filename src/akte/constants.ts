import * as dotenv from "dotenv";

import { getSiteURL } from "./lib/getSiteURL";

dotenv.config();

export const SITE_LANG = "en";
export const SITE_TITLE = "lihbr";
export const SITE_DESCRIPTION =
	"Lucie's place on the internet to share things with friends, students, and digital people.";
export const SITE_TWITTER_HANDLE = "li_hbr";
export const SITE_MAIN_AUTHOR = "Lucie Haberer";
export const SITE_ACCENT_COLOR = "#e84311";
export const SITE_BACKGROUND_COLOR = "#fff7f7";
export const SITE_META_IMAGE = {
	openGraph:
		"https://images.prismic.io/lihbr/e524336e-aebe-41c1-a158-0cf957139e6a_lihbr-apex--1.91_1.png?auto=compress,format",
	twitter:
		"https://images.prismic.io/lihbr/e524336e-aebe-41c1-a158-0cf957139e6a_lihbr-apex--1.91_1.png?auto=compress,format",
} as const;
export const SITE_TITLE_FORMAT = `%page% - ${SITE_TITLE}`;
export const PAGE_DEFAULT_TITLE = "💐";

export const TITLE_LIMIT = 50;
export const DESCRIPTION_LIMIT = 155;

export const IS_SERVERLESS = !!process.env.AWS_LAMBDA_FUNCTION_NAME;

export const SITE_URL = getSiteURL();

const commitRef = process.env.COMMIT_REF || "unknown";
const repositoryURL = process.env.REPOSITORY_URL || "https://example.com/dev";
export const NETLIFY = {
	commitRef,
	commitRefShort: commitRef.slice(0, 7),
	commitURL: `${repositoryURL}/commit/${commitRef}`,
	repositoryURL,
	buildTime: Date.now(),
} as const;
