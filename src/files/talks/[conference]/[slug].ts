import type { GlobalData, TalkData } from "../../../akte/types"

import { defineAkteFiles } from "akte"
import { readAllDataJSON } from "../../../akte/data"
import { dateToUSDate } from "../../../akte/date"

import { heading } from "../../../components/heading"

import { page } from "../../../layouts/page"

export const slug = defineAkteFiles<GlobalData, ["conference", "slug"]>().from({
	path: "/talks/:conference/:slug",
	async bulkData() {
		const talks = await readAllDataJSON<TalkData>({ type: "talks" })

		const files: Record<string, TalkData> = {}
		for (const talk of Object.values(talks)) {
			files[`/talks/${talk.conference.slug}/${talk.slug}`] = talk
		}

		return files
	},
	async render(context) {
		const talk = context.data

		const marquee = /* html */ `<figure id="referred" class="marquee hidden" data-text="Thanks for joining my talk!" data-confetti="${talk.confetti.join(
			",",
		)}"><span class="sr-only">Thanks for joining my talk!</span></figure>`

		const hero = /* html */ `
			<header class="section space-y-6">
				${heading(talk.title, { as: "h1", class: "heading-1" })}
				<p>${talk.lead}</p>
				<dl class="dl">
					<div>
						<dt>Time</dt>
						<dd><time datetime="${talk.date}">${dateToUSDate(talk.date)}</time></dd>
					</div>
					<div>
						<dt>Duration</dt>
						<dd>${talk.durationMinutes}-minute</dd>
					</div>
					<div>
						<dt>Conference</dt>
						<dd>
							<a href="${
								talk.conference.url
							}" class="underline" target="_blank" rel="noreferrer">
								${talk.conference.name}
							</a>
						</dd>
					</div>
				</dl>
			</header>`

		const links = /* html */ `
			<section class="section space-y-6">
				${heading("Resources", { as: "h2", class: "heading-2" })}
				<ul class="list-disc list-inside">
					${talk.links
						.map((link) => {
							return /* html */ `
							<li>
								<a href="${link.url}" class="lowercase underline" target="_blank" rel="noreferrer">
									${link.name}
								</a>
							</li>`
						})
						.join("\n")}
				</ul>
			</section>`

		const feedback = /* html */ `
			<section class="section space-y-6">
				${heading("Any feedback? Drop me a line~", { as: "h2", class: "heading-2" })}
				<p>
					I'd love to hear your thoughts, whether about my talk or anything else on your mind! You can reach out to me on any of the following platforms.
				</p>
				<ul class="list-disc list-inside">
					<li>
						<a href="https://bsky.app/profile/lihbr.com" class="lowercase underline" target="_blank" rel="noreferrer">Bluesky</a>
					</li>
					<li>
						<a href="https://www.instagram.com/lihbr.png" class="lowercase underline" target="_blank" rel="noreferrer">Instagram</a>
					</li>
					<li>
						<a href="https://mastodon.social/@lihbr" class="lowercase underline" target="_blank" rel="noreferrer">Mastodon</a>
					</li>
				</ul>
			</section>`

		const meta = {
			title: talk.title,
			description: `Resources from my talk during ${talk.conference.name}`,
		}

		return page([marquee, hero, links, feedback].join("\n"), {
			path: context.path,
			...meta,
			script: "/assets/js/talks_conference_slug.ts",
		})
	},
})
