import { defineAkteFile } from "akte"
import * as prismic from "@prismicio/client"

import { getClient } from "../../akte/prismic"
import type { GlobalData } from "../../akte/types"

import { heading } from "../../components/heading"

import { page } from "../../layouts/page"

export const index = defineAkteFile<GlobalData>().from({
	path: "/art",
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
		const hero = /* html */ `
			<header class="section space-y-6">
				${heading("Art", { as: "h1", class: "heading-1" })}
				<p>
					I share now and then artists' work.<br />
					Their work is really inspiring to me.
				</p>
				<p>
					If you'd like an artist to be shared here, or if you're one,
					<a href="/contact" class="underline">let me know</a>~
				</p>
				<p>
					Enjoy all entries below -^
				</p>
			</header>`

		const arts = context.data.arts
			.map((art) => {
				const title = prismic.asText(art.data.title) || "unknown"
				const type = art.data.type
				const artist = {
					name: prismic.asText(art.data.credit_artist_name),
					link: prismic.asLink(art.data.credit_artist_link),
				}
				const submitter = {
					name: prismic.asText(art.data.credit_submitter_name),
					link: prismic.asLink(art.data.credit_submitter_link),
				}
				const image = {
					src: prismic.asImageSrc(art.data.picture, { auto: ["format"] }),
					alt: art.data.picture.alt || "",
					raw: prismic.asImageSrc(art.data.picture, {
						auto: ["format"],
						rect: undefined,
						w: undefined,
						h: undefined,
					}),
				}

				return /* html */ `
			<section class="section space-y-6">
				${heading(title, { as: "h2", class: "heading-2" })}
				<p>
					${type} by <a href="${
					artist.link
				}" target="_blank" rel="noopener noreferrer" class="underline">${
					artist.name
				}</a>
					${
						submitter.name
							? /* html */ `<br />
					Submission by <a href="${submitter.link}" target="_blank" rel="noopener noreferrer" class="underline">${submitter.name}</a>`
							: ""
					}
				</p>
				<figure>
					<img src="${image.src}" alt="${image.alt}" loading="lazy" class="nofilter" />
					<figcaption class="mt-6">
						<a href="${
							image.raw
						}" title="Permalink to full size image" class="lowercase underline" target="_blank" rel="noopener noreferrer">
							View full size
						</a>
					</figcaption>
				</figure>
			</section>
			`
			})
			.join("\n")

		return page([hero, arts].join("\n"), { path: context.path, title: "Art" })
	},
})
