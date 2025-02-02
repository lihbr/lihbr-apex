import type { GlobalData } from "../../akte/types"
import * as prismic from "@prismicio/client"
import { defineAkteFiles, NotFoundError } from "akte"

import escapeHTML from "escape-html"
import {
	SITE_MAIN_AUTHOR,
	SITE_META_IMAGE,
	SITE_TITLE,
	SITE_URL,
} from "../../akte/constants"
import { dateToUSDate } from "../../akte/date"
import { asyncAsHTML, getClient } from "../../akte/prismic"

import { heading } from "../../components/heading"

import { page } from "../../layouts/page"

export const slug = defineAkteFiles<GlobalData, ["slug"]>().from({
	path: "/posts/:slug",
	async data(context) {
		const post = await getClient().getByUID("post__blog", context.params.slug)

		if (!post) {
			throw new NotFoundError(context.path)
		}

		return post
	},
	async bulkData() {
		const posts = await getClient().getAllByType("post__blog")

		const files: Record<string, prismic.PrismicDocument> = {}
		for (const post of posts) {
			if (!post.url) {
				throw new Error(
					`Unable to resolve URL for document: ${JSON.stringify(post)}`,
				)
			}
			files[post.url] = post
		}

		return files
	},
	async render(context) {
		const post = context.data

		const title = prismic.asText(post.data.title) || "unknown"
		const lead = prismic.asText(post.data.lead)
		const body = await asyncAsHTML(post.data.body)

		const pubDate = post.data.published_date
		const category = post.data.category
		const thumbnail = prismic.asImageSrc(post.data.thumbnail, {
			rect: undefined,
			w: undefined,
			h: undefined,
		})

		const slot = /* html */ `
			<header class="section space-y-6">
				${heading(title, { as: "h1", class: "heading-1" })}
				<p>${lead}</p>
				<dl class="dl">
					<div>
						<dt>Time</dt>
						<dd><time datetime="${pubDate}">${dateToUSDate(pubDate)}</time></dd>
					</div>
					<div>
						<dt>Category</dt>
						<dd class="lowercase">${category}</dd>
					</div>
					<div>
						<dt>Thumbnail</dt>
						<dd>
							<figure>
								<figcaption>
									<a href="${thumbnail}" title="Permalink to full size image" class="lowercase underline" target="_blank" rel="noreferrer">
										View full size
									</a>
								</figcaption>
							</figure>
						</dd>
					</div>
				</dl>
			</header>
			<article class="section space-y-6 prose">
				${body}
			</article>`

		const meta = {
			title: post.data.meta_title,
			description: post.data.meta_description,
			image: { openGraph: post.data.meta_image?.url },
			structuredData: [
				{
					"@context": "http://schema.org",
					"@type": "BlogPosting",

					"mainEntityOfPage": {
						"@type": "WebSite",
						"@id": escapeHTML(SITE_URL),
					},

					"url": escapeHTML(`${SITE_URL}${post.url}`),
					"name": escapeHTML(title),
					"alternateName": escapeHTML(SITE_TITLE),
					"headline": escapeHTML(title),
					"image": escapeHTML(
						post.data.meta_image?.url ?? SITE_META_IMAGE.openGraph,
					),
					"description": escapeHTML(lead),
					"datePublished": escapeHTML(pubDate),
					"dateModified": escapeHTML(post.last_publication_date),

					"author": {
						"@type": "Person",
						"name": escapeHTML(SITE_MAIN_AUTHOR),
					},

					"publisher": {
						"@type": "Organization",
						"url": escapeHTML(SITE_URL),
						"logo": {
							"@type": "ImageObject",
							"url": escapeHTML(SITE_META_IMAGE.openGraph),
						},
						"name": escapeHTML(SITE_TITLE),
					},
				},
			],
		}

		return page(slot, { path: context.path, ...meta })
	},
})
