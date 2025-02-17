import type { GlobalData } from "../../akte/types"

import process from "node:process"
import * as prismic from "@prismicio/client"

import { defineAkteFiles, NotFoundError } from "akte"
import { dateToUSDate } from "../../akte/date"
import { asHTML, asyncAsHTML, getClient } from "../../akte/prismic"
import { sha256 } from "../../akte/sha256"

import { heading } from "../../components/heading"
import { notIndexed } from "../../components/notIndexed"

import { minimal } from "../../layouts/minimal"

export const slug = defineAkteFiles<GlobalData, ["slugWithHash"]>().from({
	path: "/private/:slugWithHash",
	async data(context) {
		const [hash, ...guls] = context.params.slugWithHash.split("-").reverse()
		const slug = guls.reverse().join("-")

		if (hash !== await sha256(slug, process.env.PRISMIC_TOKEN!, 7)) {
			throw new NotFoundError(context.path)
		}

		const doc = await getClient().getByUID("post__document--private", slug)

		if (!doc) {
			throw new NotFoundError(context.path)
		}

		return doc
	},
	async bulkData() {
		const docs = await getClient().getAllByType("post__document--private")

		const files: Record<string, prismic.PrismicDocument> = {}
		for (const doc of docs) {
			if (!doc.url) {
				throw new Error(
					`Unable to resolve URL for document: ${JSON.stringify(doc)}`,
				)
			}
			files[`${doc.url}-${await sha256(doc.uid!, process.env.PRISMIC_TOKEN!, 7)}`] = doc
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
			${notIndexed(context.path)}
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

		return minimal(slot, { path: context.path, ...meta, noindex: true })
	},
})
