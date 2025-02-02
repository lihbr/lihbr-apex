import type { GlobalData } from "../akte/types"
import * as prismic from "@prismicio/client"

import { defineAkteFiles, NotFoundError } from "akte"
import { dateToUSDate } from "../akte/date"
import { asHTML, asyncAsHTML, getClient } from "../akte/prismic"

import { heading } from "../components/heading"

import { page } from "../layouts/page"

export const slug = defineAkteFiles<GlobalData, ["slug"]>().from({
	path: "/:slug",
	async data(context) {
		const doc = await getClient().getByUID(
			"post__document",
			context.params.slug,
		)

		if (!doc) {
			throw new NotFoundError(context.path)
		}

		return doc
	},
	async bulkData() {
		const docs = await getClient().getAllByType("post__document")

		const files: Record<string, prismic.PrismicDocument> = {}
		for (const doc of docs) {
			if (!doc.url) {
				throw new Error(
					`Unable to resolve URL for document: ${JSON.stringify(doc)}`,
				)
			}
			files[doc.url] = doc
		}

		return files
	},
	async render(context) {
		const doc = context.data

		const title = prismic.asText(doc.data.title) || "unknown"
		const lead = asHTML(doc.data.lead)
		const body = await asyncAsHTML(doc.data.body)

		const pubDate = doc.last_publication_date

		const slot = /* html */ `
			<header class="section space-y-6 prose">
				${heading(title, { as: "h1" })}
				${lead}
			</header>
			<article class="section space-y-6 prose">
				${body}
				<p>
					Last updated: <time datetime="${pubDate}">${dateToUSDate(pubDate)}</time>
				</p>
			</article>`

		const meta = {
			title: doc.data.meta_title,
			description: doc.data.meta_description,
			image: { openGraph: doc.data.meta_image?.url },
		}

		return page(slot, { path: context.path, ...meta })
	},
})
