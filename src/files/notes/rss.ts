import { defineAkteFile } from "akte";

import {
	NETLIFY,
	SITE_LANG,
	SITE_META_IMAGE,
	SITE_URL,
} from "../../akte/constants";
import type { GlobalData } from "../../akte/types";
import { dateToISOFormat } from "../../akte/date";
import { readAllDataHTML } from "../../akte/data";
import { slugify } from "../../akte/slufigy";

export const rss = defineAkteFile<GlobalData>().from({
	path: "/notes/rss.xml",
	async data() {
		const notes = await readAllDataHTML<{ date: string }>({ type: "notes" });

		return {
			notes: Object.keys(notes)
				.map((path) => {
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					const title = path.split("/").pop()!.replace(".md", "");

					return {
						date: notes[path].matter.date,
						slug: slugify(title),
						title,
					};
				})
				.sort((note1, note2) => note2.date.localeCompare(note1.date)),
		};
	},
	render(context) {
		const items = context.data.notes
			.map((note) => {
				const url = `${SITE_URL}/notes/${note.slug}`;

				const title = note.title;

				const pubDate = note.date;

				return /* xml */ `		<item>
			<title><![CDATA[${title}]]></title>
			<link>${url}</link>
			<guid>${url}</guid>
			<pubDate>${dateToISOFormat(pubDate)}</pubDate>
			<content:encoded><![CDATA[A new note <em>"${title}"</em> is available, you can <a href="${url}">check it out here</a>.]]></content:encoded>
		</item>`;
			})
			.join("\n");

		return /* xml */ `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/">
	<channel>
		<title><![CDATA[lihbr.com notes]]></title>
		<link>${SITE_URL}/notes/rss.xml</link>
		<description><![CDATA[New notes published on Lucie's website: lihbr.com]]></description>
		<lastBuildDate>${dateToISOFormat(NETLIFY.buildTime)}</lastBuildDate>
		<docs>https://validator.w3.org/feed/docs/rss2.html</docs>
		<language>${SITE_LANG}</language>
		<image>
			<title><![CDATA[lihbr.com notes]]></title>
			<url>${SITE_META_IMAGE.openGraph}</url>
			<link>${SITE_URL}/notes/rss.xml</link>
		</image>
${items}
	</channel>
</rss>
`;
	},
});
