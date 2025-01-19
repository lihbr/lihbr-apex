import type { GlobalData } from "../../akte/types"

import { defineAkteFile } from "akte"
import {
	NETLIFY,
	SITE_LANG,
	SITE_META_IMAGE,
	SITE_URL,
} from "../../akte/constants"
import { readAllDataHTML } from "../../akte/data"
import { dateToISO } from "../../akte/date"
import { slugify } from "../../akte/slufigy"

export const rss = defineAkteFile<GlobalData>().from({
	path: "/notes/rss.xml",
	async data() {
		const notes = await readAllDataHTML<{
			first_publication_date: string
			last_publication_date: string
		}>({ type: "notes" })

		return {
			notes: Object.keys(notes)
				.map((path) => {
					const title = path.split("/").pop()!.replace(".md", "")

					return {
						first_publication_date: notes[path].matter.first_publication_date,
						slug: slugify(title),
						title,
					}
				})
				.sort((note1, note2) =>
					note2.first_publication_date.localeCompare(
						note1.first_publication_date,
					),
				),
		}
	},
	render(context) {
		const items = context.data.notes
			.map((note) => {
				const url = `${SITE_URL}/notes/${note.slug}`

				const title = note.title

				const pubDate = note.first_publication_date

				return /* xml */ `		<item>
			<title><![CDATA[${title}]]></title>
			<link>${url}</link>
			<guid>${url}</guid>
			<pubDate>${dateToISO(pubDate)}</pubDate>
			<content:encoded><![CDATA[A new note <em>"${title}"</em> is available, you can <a href="${url}">check it out here</a>.]]></content:encoded>
		</item>`
			})
			.join("\n")

		return /* xml */ `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/">
	<channel>
		<title><![CDATA[lihbr.com notes]]></title>
		<link>${SITE_URL}/notes/rss.xml</link>
		<description><![CDATA[New notes published on Lucie's website: lihbr.com]]></description>
		<lastBuildDate>${dateToISO(NETLIFY.buildTime)}</lastBuildDate>
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
`
	},
})
