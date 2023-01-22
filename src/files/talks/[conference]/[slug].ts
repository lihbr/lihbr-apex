import { defineAkteFiles } from "akte";

import { dateToUSFormat } from "../../../akte/date";
import { readAllDataJSON } from "../../../akte/data";
import type { GlobalData, TalkData } from "../../../akte/types";

import { heading } from "../../../components/heading";

import { page } from "../../../layouts/page";

export const slug = defineAkteFiles<GlobalData, ["conference", "slug"]>().from({
	path: "/talks/:conference/:slug",
	async bulkData() {
		const talks = await readAllDataJSON<TalkData>({ type: "talks" });

		const files: Record<string, TalkData> = {};
		for (const talk of Object.values(talks)) {
			files[`/talks/${talk.conference.slug}/${talk.slug}`] = talk;
		}

		return files;
	},
	async render(context) {
		const talk = context.data;

		const marquee = /* html */ `<figure id="referred" class="marquee hidden" data-text="Thanks for joining my talk!" data-confetti="${talk.confetti.join(
			",",
		)}"><span class="sr-only">Thanks for joining my talk!</span></figure>`;

		const hero = /* html */ `
			<header class="section space-y-6">
				${heading(talk.title, { as: "h1", class: "heading-1" })}
				<p>${talk.lead}</p>
				<dl class="dl">
					<div>
						<dt>Time</dt>
						<dd><time datetime="${talk.date}">${dateToUSFormat(talk.date)}</time></dd>
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
							}" class="underline" target="_blank" rel="noopener noreferrer">
								${talk.conference.name}
							</a>
						</dd>
					</div>
				</dl>
			</header>`;

		const links = /* html */ `
			<section class="section space-y-6">
				${heading("Resources", { as: "h2", class: "heading-2" })}
				<ul class="list-disc list-inside">
					${talk.links
						.map((link) => {
							return /* html */ `
							<li>
								<a href="${link.url}" class="lowercase underline" target="_blank" rel="noopener noreferrer">
									${link.name}
								</a>
							</li>`;
						})
						.join("\n")}
				</ul>
			</section>`;

		const feedback = /* html */ `
			<section class="section space-y-6">
				${heading("Any feedback? Drop me a line~", { as: "h2", class: "heading-2" })}
				<form id="feedback" class="form space-y-2" action="https://twitter.com/intent/tweet" method="GET" target="_blank" rel="noopener noreferrer">
					<input type="hidden" name="hashtags" value="${talk.feedback.hashtags}">
					<input type="hidden" name="related" value="${talk.feedback.related}">
					<input type="hidden" name="via" value="${talk.feedback.via}">
					<textarea name="feedback" rows="3" class="resize-none" placeholder="Thanks for the talk!" minlength="7" maxlength="260" required aria-label="Your feedback"></textarea>
					<button type="submit" class="lowercase"><span class="underline">Send</span> -></button>
				</form>
			</section>`;

		const meta = {
			title: talk.title,
			description: talk.lead,
		};

		return page([marquee, hero, links, feedback].join("\n"), {
			path: context.path,
			...meta,
			script: "/assets/js/talks_conference_slug.ts",
		});
	},
});
