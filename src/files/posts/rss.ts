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
import { dateToISOFormat } from "../../akte/date"
import { getClient } from "../../akte/prismic"

export const rss = defineAkteFile<GlobalData>().from({
	path: "/posts/rss.xml",
	async data() {
		const posts = await getClient().getAllByType("post__blog", {
			orderings: {
				field: "my.post__blog.published_date",
				direction: "desc",
			},
		})

		return { posts }
	},
	render(context) {
		const items = context.data.posts
			.map((post) => {
				const url = `${SITE_URL}${post.url}`

				const title = prismic.asText(post.data.title)
				const lead = prismic.asText(post.data.lead)

				const pubDate = post.data.published_date
				const thumbnail = escapeHTML(prismic.asImageSrc(post.data.meta_image))

				return /* xml */ `		<item>
			<title><![CDATA[${title}]]></title>
			<link>${url}</link>
			<guid>${url}</guid>
			<pubDate>${dateToISOFormat(pubDate)}</pubDate>
			<content:encoded><![CDATA[A new post <em>"${title}"</em> is available, you can <a href="${url}">check it out here</a>.<br />${lead}]]></content:encoded>
			<enclosure url="${thumbnail}" length="0" type="image/jpg" />
		</item>`
			})
			.join("\n")

		return /* xml */ `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/">
	<channel>
		<title><![CDATA[lihbr.com posts]]></title>
		<link>${SITE_URL}/posts/rss.xml</link>
		<description><![CDATA[New posts published on Lucie's website: lihbr.com]]></description>
		<lastBuildDate>${dateToISOFormat(NETLIFY.buildTime)}</lastBuildDate>
		<docs>https://validator.w3.org/feed/docs/rss2.html</docs>
		<language>${SITE_LANG}</language>
		<image>
			<title><![CDATA[lihbr.com posts]]></title>
			<url>${SITE_META_IMAGE.openGraph}</url>
			<link>${SITE_URL}/posts/rss.xml</link>
		</image>
${items}
	</channel>
</rss>
`
	},
})
