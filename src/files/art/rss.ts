import type { GlobalData } from "../../akte/types"
import * as prismic from "@prismicio/client"
import { defineAkteFile } from "akte"

import escapeHTML from "escape-html"
import {
	NETLIFY,
	SITE_LANG,
	SITE_META_IMAGE,
	SITE_URL,
} from "../../akte/constants"
import { dateToISO } from "../../akte/date"
import { getClient } from "../../akte/prismic"
import { slugify } from "../../akte/slufigy"

export const rss = defineAkteFile<GlobalData>().from({
	path: "/art/rss.xml",
	async data() {
		const arts = await getClient().getAllByType("post__art", {
			orderings: {
				field: "my.post__art.published_date",
				direction: "desc",
			},
		})

		return { arts }
	},
	render(context) {
		const items = context.data.arts
			.map((art) => {
				const title = prismic.asText(art.data.title) || "unknown"
				const url = `${SITE_URL}/art#${slugify(title)}`

				const pubDate = art.data.published_date
				const artist = prismic.asText(art.data.credit_artist_name) || "unknown"
				const image = escapeHTML(prismic.asImageSrc(art.data.picture))

				return /* xml */ `		<item>
			<title><![CDATA[${title}]]></title>
			<link>${url}</link>
			<guid>${url}</guid>
			<pubDate>${dateToISO(pubDate)}</pubDate>
			<content:encoded><![CDATA[A new art piece <em>"${title}"</em> by <em>${artist}</em> is available, you can <a href="${url}">check it out here</a>.]]></content:encoded>
			<enclosure url="${image}" length="0" type="image/jpg" />
		</item>`
			})
			.join("\n")

		return /* xml */ `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/">
	<channel>
		<title><![CDATA[lihbr.com art]]></title>
		<link>${SITE_URL}/art/rss.xml</link>
		<description><![CDATA[New art pieces curated on Lucie's website: lihbr.com]]></description>
		<lastBuildDate>${dateToISO(NETLIFY.buildTime)}</lastBuildDate>
		<docs>https://validator.w3.org/feed/docs/rss2.html</docs>
		<language>${SITE_LANG}</language>
		<image>
			<title><![CDATA[lihbr.com art]]></title>
			<url>${SITE_META_IMAGE.openGraph}</url>
			<link>${SITE_URL}/art/rss.xml</link>
		</image>
${items}
	</channel>
</rss>`
	},
})
