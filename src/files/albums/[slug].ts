import process from "node:process"

import { NotFoundError, defineAkteFiles } from "akte"
import * as prismic from "@prismicio/client"

import { getClient, getImages } from "../../akte/prismic"
import { dateToUSFormat } from "../../akte/date"
import { sha256 } from "../../akte/sha256"
import type { GlobalData } from "../../akte/types"

import { heading } from "../../components/heading"

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
			<header class="section space-y-6 prose">
				${heading(title, { as: "h1" })}
				<dl class="dl">
					<div>
						<dt>Time</dt>
						<dd><time datetime="${pubDate}">${dateToUSFormat(pubDate)}</time></dd>
					</div>
				</dl>
			</header>
			<article class="section space-x-6 !max-w-none flex items-stretch overflow-auto scrollbar-thin cursor-grabbing">
				${pictures.map((picture) => {
					const src = prismic.asImageSrc(picture, { h: 800 })
					const raw = prismic.asImageSrc(picture, {
						rect: undefined,
						w: undefined,
						h: undefined,
					})

					return /* html */ `
						<figure class="flex-[1_0_auto] flex flex-col">
							<img src="${src}" alt="${picture.alt}" loading="lazy" class="nofilter h-[calc(100vh-7rem)] max-h-[800px]" />
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
			title: doc.data.meta_title,
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
