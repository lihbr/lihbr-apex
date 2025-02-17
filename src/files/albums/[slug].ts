import type { GlobalData, PrismicImage } from "../../akte/types"

import process from "node:process"
import * as prismic from "@prismicio/client"
import { defineAkteFiles, NotFoundError } from "akte"

import { dateToUSDate } from "../../akte/date"
import { getClient, getImagesWithJson } from "../../akte/prismic"
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
			getImagesWithJson({ tag: slug }),
		])

		if (!doc || !pictures.length) {
			throw new NotFoundError(context.path)
		}

		return { doc, pictures }
	},
	async bulkData() {
		const docs = await getClient().getAllByType("post__album")

		const files: Record<string, { doc: prismic.PrismicDocument, pictures: PrismicImage[] }> = {}
		for (const doc of docs) {
			if (!doc.url) {
				throw new Error(
					`Unable to resolve URL for document: ${JSON.stringify(doc)}`,
				)
			}
			files[`${doc.url}-${await sha256(doc.uid!, process.env.PRISMIC_TOKEN!, 7)}`] = {
				doc,
				pictures: await getImagesWithJson({ tag: doc.uid! }),
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
						<dd><time datetime="${pubDate}">${dateToUSDate(pubDate)}</time></dd>
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
								<a href="${raw}" title="Permalink to full size image" class="lowercase underline" target="_blank" rel="noreferrer">
									View full size
								</a>
							</figcaption>
						</figure>
					`
				}).join("\n")}
			</article>`

		const metaImageBase = doc.data.meta_image?.url
			? { url: doc.data.meta_image?.url?.split("?")[0] }
			: pictures[0]
		const mask = prismic.asImageSrc(metaImageBase, { auto: ["format"], h: 800, pad: 40, bg: "#fffefe" })!
		const metaImage = prismic.asImageSrc(metaImageBase, {
			auto: undefined,
			w: 1200,
			h: 630,
			fit: "crop",
			exp: -40,
			blur: 80,
			duotone: ["131010", "fffefe"],
			markW: 1080,
			markH: 510,
			markAlign: ["center", "middle"],
			mark: mask,
		})!

		const meta = {
			title: doc.data.meta_title || `${dateToUSDate(pubDate)} ${title}`,
			description: doc.data.meta_description,
			image: { openGraph: metaImage },
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
