import type { GlobalData, TalkData } from "../../akte/types"

import { defineAkteFile } from "akte"
import {
	NETLIFY,
	SITE_LANG,
	SITE_META_IMAGE,
	SITE_URL,
} from "../../akte/constants"
import { readAllDataJSON } from "../../akte/data"
import { dateToISOFormat } from "../../akte/date"

export const rss = defineAkteFile<GlobalData>().from({
	path: "/talks/rss.xml",
	async data() {
		const talks = await readAllDataJSON<TalkData>({ type: "talks" })

		return { talks: Object.values(talks).reverse() }
	},
	render(context) {
		const items = context.data.talks
			.map((talk) => {
				const url = `${SITE_URL}/talks/${talk.conference.slug}/${talk.slug}`

				const title = talk.title
				const lead = talk.lead

				const pubDate = talk.date

				return /* xml */ `		<item>
			<title><![CDATA[${title}]]></title>
			<link>${url}</link>
			<guid>${url}</guid>
			<pubDate>${dateToISOFormat(pubDate)}</pubDate>
			<content:encoded><![CDATA[A new talk <em>"${title}"</em> is available, you can <a href="${url}">check it out here</a>.<br />${lead}]]></content:encoded>
		</item>`
			})
			.join("\n")

		return /* xml */ `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/">
	<channel>
		<title><![CDATA[lihbr.com talks]]></title>
		<link>${SITE_URL}/talks/rss.xml</link>
		<description><![CDATA[New talks published on Lucie's website: lihbr.com]]></description>
		<lastBuildDate>${dateToISOFormat(NETLIFY.buildTime)}</lastBuildDate>
		<docs>https://validator.w3.org/feed/docs/rss2.html</docs>
		<language>${SITE_LANG}</language>
		<image>
			<title><![CDATA[lihbr.com talks]]></title>
			<url>${SITE_META_IMAGE.openGraph}</url>
			<link>${SITE_URL}/talks/rss.xml</link>
		</image>
${items}
	</channel>
</rss>
`
	},
})
