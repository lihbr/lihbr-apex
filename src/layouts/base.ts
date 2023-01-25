import escapeHTML from "escape-html";

import {
	DESCRIPTION_LIMIT,
	IS_SERVERLESS,
	PAGE_DEFAULT_TITLE,
	SITE_ACCENT_COLOR,
	SITE_BACKGROUND_COLOR,
	SITE_DESCRIPTION,
	SITE_LANG,
	SITE_META_IMAGE,
	SITE_TITLE,
	SITE_TITLE_FORMAT,
	SITE_TWITTER_HANDLE,
	SITE_URL,
	TITLE_LIMIT,
} from "../akte/constants";

const inlineScript = /* html */ `<script>(()=>{let d=document,c=d.documentElement.classList,f=()=>c.add("font-feature-settings");c[localStorage.theme==="dark"||!("theme"in localStorage)&&window.matchMedia("(prefers-color-scheme: dark)").matches?"add":"remove"]("dark");c.add(["navy","beet","flamingo","ochre","butter","mantis"][Math.floor(Math.random()*6)],localStorage.alignment||"center");window.performance.getEntriesByName(\`\${window.location.origin}/assets/fonts/graphit-400.woff2\`)[0]?.transferSize<1000?f():d.fonts.ready.then(f)&&d.fonts.addEventListener("loadingdone",f,{once:true})})()</script>`;

const prismicToolbarScript = IS_SERVERLESS
	? /* html */ `<script async defer src="https://static.cdn.prismic.io/prismic.js?new=true&repo=${process.env.PRISMIC_ENDPOINT}"></script><script>window.addEventListener("prismicPreviewEnd",(event)=>{event.preventDefault();window.location.replace(window.location.pathname.replace(/^\/preview/g, ""));});</script>`
	: "";

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

export type BaseArgs = {
	path: string;
	title?: string | null;
	description?: string | null;
	image?: {
		openGraph?: string;
		twitter?: string;
	};
	structuredData?: unknown[];
	script?: string;
};

export const base = (slot: string, args: BaseArgs): string => {
	const url = `${SITE_URL}${args.path}`.replace(/\/$/, "");

	const title = escapeHTML(
		SITE_TITLE_FORMAT.replace(
			"%page%",
			limitLength(args.title || PAGE_DEFAULT_TITLE, TITLE_LIMIT),
		),
	);
	const description = escapeHTML(
		limitLength(args.description || SITE_DESCRIPTION, DESCRIPTION_LIMIT),
	);
	const image = {
		openGraph: args?.image?.openGraph || SITE_META_IMAGE.openGraph,
		twitter: args?.image?.twitter || SITE_META_IMAGE.twitter,
	};

	const structuredData: unknown[] = [
		{
			"@context": "http://schema.org",
			"@type": "WebSite",
			"url": escapeHTML(url),
			"name": args.title || PAGE_DEFAULT_TITLE,
			"alternateName": SITE_TITLE,
		},
	];
	if (args.structuredData) {
		structuredData.push(...args.structuredData);
	}

	const script = (args.script || "/assets/js/_base.ts").replace(
		IS_SERVERLESS ? ".ts" : ".js",
		".js",
	);

	return /* html */ `<!doctype html>
<html lang="${SITE_LANG}">
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<link rel="canonical" href="${url}" />

		<title>${title}</title>
		<meta name="description" content="${description}">

		<meta property="og:site_name" content="${SITE_TITLE}">
		<meta property="og:type" content="website">
		<meta property="og:url" content="${url}">

		<meta property="og:title" content="${title}">
		<meta property="og:description" content="${description}">
		<meta property="og:image" content="${image.openGraph}">

		<meta name="twitter:card" content="summary_large_image">
		<meta name="twitter:site" content="@${SITE_TWITTER_HANDLE}">

		<meta name="twitter:title" content="${title}">
		<meta name="twitter:description" content="${description}">
		<meta name="twitter:image" content="${image.twitter}">

		<script type="application/ld+json">${JSON.stringify(structuredData)}</script>

		<link rel="icon" type="image/x-icon" href="/favicon.ico">
		<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
		<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
		<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
		<link rel="mask-icon" href="/safari-pinned-tab.svg" color="${SITE_ACCENT_COLOR}">
		<meta name="msapplication-TileColor" content="${SITE_ACCENT_COLOR}">
		<meta name="theme-color" content="${SITE_BACKGROUND_COLOR}">

		<link rel="preload" href="/assets/fonts/graphit-400.woff2" as="font" type="font/woff2" crossorigin>
		<link rel="stylesheet" href="/assets/css/style.css" />

		${inlineScript}
	</head>
	<body>
		${slot}
		${prismicToolbarScript}
		<script type="module" src="${script}"></script>
	</body>
</html>`;
};
