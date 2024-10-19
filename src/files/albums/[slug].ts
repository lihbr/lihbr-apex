import type { GlobalData } from "../../akte/types"

import process from "node:process"
import * as prismic from "@prismicio/client"

import { defineAkteFiles, NotFoundError } from "akte"
import { dateToUSFormat } from "../../akte/date"
import { getClient, getImages } from "../../akte/prismic"
import { sha256 } from "../../akte/sha256"

import { heading } from "../../components/heading"
import { notIndexed } from "../../components/notIndexed"

import { minimal } from "../../layouts/minimal"

export const slug = defineAkteFiles<GlobalData, ["slugWithHash"]>().from({
	path: "/albums/:slugWithHash",
	async data(context) {
		const [hash, ...guls] = context.params.slugWithHash.split("-").reverse()
		const slug = guls.reverse().join("-")

		if (hash !== await sha256(slug, process.env.PRISMIC_TOKEN!, 7)) {
			throw new NotFoundError(context.path)
		}

		const [doc, pictures] = await Promise.all([
			getClient().getByUID("post__album", slug),
			getImages({ tag: slug }),
		])

		if (!doc || !pictures.length) {
			throw new NotFoundError(context.path)
		}

		return { doc, pictures }
	},
	async bulkData() {
		const docs = await getClient().getAllByType("post__album")

		const files: Record<string, { doc: prismic.PrismicDocument, pictures: prismic.ImageFieldImage[] }> = {}
		for (const doc of docs) {
			if (!doc.url) {
				throw new Error(
					`Unable to resolve URL for document: ${JSON.stringify(doc)}`,
				)
			}
			files[`${doc.url}-${await sha256(doc.uid!, process.env.PRISMIC_TOKEN!, 7)}`] = {
				doc,
				pictures: await getImages({ tag: doc.uid! }),
			}
		}

		return files
	},
	async render(context) {
		const { doc, pictures } = context.data

		const title = prismic.asText(doc.data.title) || "unknown"
		const pubDate = doc.data.published_date

		const slot = /* html */ `
			${notIndexed(context.path, "album")}
			<header class="section space-y-6 prose">
				${heading(title, { as: "h1" })}
				<dl class="dl">
					<div>
						<dt>Time</dt>
						<dd><time datetime="${pubDate}">${dateToUSFormat(pubDate)}</time></dd>
					</div>
					<div>
						<dt>Pictures</dt>
						<dd>${pictures.length}</dd>
					</div>
				</dl>
			</header>
			<article class="section space-y-6 scrollbar-thin sm:space-y-0 sm:space-x-6 sm:!max-w-none sm:flex sm:items-stretch sm:overflow-auto sm:cursor-grabbing">
				${pictures.map((picture) => {
					const src = prismic.asImageSrc(picture, { auto: ["format"], h: 800 })
					const raw = prismic.asImageSrc(picture, {
						auto: ["format"],
						rect: undefined,
						w: undefined,
						h: undefined,
					})

					return /* html */ `
						<figure class="sm:flex-[1_0_auto] sm:flex sm:flex-col sm:pb-1">
							<img src="${src}" alt="${picture.alt || ""}" loading="lazy" class="nofilter sm:h-[calc(100vh-3.25rem)] sm:max-h-[800px]" />
							<figcaption>
								<a href="${raw}" title="Permalink to full size image" class="lowercase underline" target="_blank" rel="noopener noreferrer">
									View full size
								</a>
							</figcaption>
						</figure>
					`
				}).join("\n")}
			</article>`

		const meta = {
			title: doc.data.meta_title || `${dateToUSFormat(pubDate)} ${title}`,
			description: doc.data.meta_description,
			image: {
				openGraph: doc.data.meta_image?.url,
				twitter: doc.data.meta_image?.twitter_variant?.url,
			},
		}

		return minimal(slot, {
			path: context.path,
			...meta,
			noindex: true,
			backTo: "/albums",
			script: "/assets/js/albums_slug.ts",
		})
	},
})
