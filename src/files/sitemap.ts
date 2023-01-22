import { defineAkteFile } from "akte";
import type * as prismic from "@prismicio/client";

import { getClient } from "../akte/prismic";
import { readAllDataJSON } from "../akte/data";
import { dateToISOFormat } from "../akte/date";
import { NETLIFY, SITE_URL } from "../akte/constants";
import type { GlobalData, TalkData } from "../akte/types";

export const sitemap = defineAkteFile<GlobalData>().from({
	path: "/sitemap.xml",
	async data() {
		const mapPrismicDocuments = (
			docs: prismic.PrismicDocument[],
		): { loc: string; lastMod: string | number }[] => {
			return docs.map((doc) => {
				return {
					loc: `${SITE_URL}/${doc.url}`,
					lastMod: doc.last_publication_date || NETLIFY.buildTime,
				};
			});
		};

		const promises = [
			readAllDataJSON<TalkData>({ type: "talks" }),
			getClient().getAllByType("post__blog"),
			getClient().getAllByType("post__document"),
		] as const;

		const [talks, posts, documents] = await Promise.all(promises);

		return {
			pages: [
				{ loc: SITE_URL, lastMod: NETLIFY.buildTime },
				{ loc: `${SITE_URL}/records`, lastMod: NETLIFY.buildTime },
				{ loc: `${SITE_URL}/colors`, lastMod: NETLIFY.buildTime },
				{ loc: `${SITE_URL}/art`, lastMod: NETLIFY.buildTime },
				{ loc: `${SITE_URL}/contact`, lastMod: NETLIFY.buildTime },
				{ loc: `${SITE_URL}/contact/thanks`, lastMod: NETLIFY.buildTime },
				{ loc: `${SITE_URL}/talks/poll`, lastMod: NETLIFY.buildTime },
				...mapPrismicDocuments(posts),
				...mapPrismicDocuments(documents),
				...Object.values(talks).map((talk) => {
					return {
						loc: `${SITE_URL}/talks/${talk.conference.slug}/${talk.slug}`,
						lastMod: NETLIFY.buildTime,
					};
				}),
			],
		};
	},
	render(context) {
		const urls = context.data.pages
			.map((page) => {
				return /* xml */ `	<url>
		<loc>${page.loc}</loc>
		<lastmod>${dateToISOFormat(page.lastMod)}</lastmod>
	</url>`;
			})
			.join("\n");

		return /* xml */ `<?xml version="1.0" encoding="utf-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${urls}
</urlset>
`;
	},
});
