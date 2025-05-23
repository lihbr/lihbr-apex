import type { GlobalData, ProjectData, TalkData } from "../akte/types"
import * as prismic from "@prismicio/client"

import { defineAkteFile } from "akte"
import { readAllDataJSON } from "../akte/data"
import { dateToUSDate } from "../akte/date"
import { getClient } from "../akte/prismic"

import { banner } from "../components/banner"
import { footer } from "../components/footer"
import { heading } from "../components/heading"

import { nav } from "../components/nav"
import { base } from "../layouts/base"

export const index = defineAkteFile<GlobalData>().from({
	path: "/",
	async data() {
		const promises = [
			readAllDataJSON<TalkData>({ type: "talks" }),
			getClient().getAllByType("post__blog", {
				orderings: {
					field: "my.post__blog.published_date",
					direction: "desc",
				},
			}),
			readAllDataJSON<ProjectData>({ type: "projects" }),
		] as const

		const [talks, posts, projects] = await Promise.all(promises)

		return {
			talks: Object.values(talks)
				.filter((talk) => !talk.hidden)
				.sort((a, b) => b.date.localeCompare(a.date)),
			posts,
			projects,
		}
	},
	render(context) {
		const announcement = banner(/* html */ `<em>lucie-&gt;tokyo</em>, my photography exhibition from Japan is live! <a href="https://lucie.tokyo?source=lihbr" class="underline" target="_blank" rel="noreferrer">Check it out now</a>`)

		const hero = /* html */ `
			<main class="section space-y-6">
				${heading("Hi! Lucie here", { as: "h1", class: "heading-0" })}
				<p>
					I'm an internet citizen, currently working as a
					DevExp Engineer <a href="https://prismic.io" target="_blank" rel="noreferrer" class="underline">@prismic.io</a>
					<br />
					I'm also a contributor and team member <a href="https://nuxt.com" target="_blank" rel="noreferrer" class="underline">@nuxt.com</a>,
					enjoying open-source overall.
					<br />
					Learn more about me and this place on <a href="/about" class="underline">the about page</a>,
					or appreciate the following~
				</p>
			</main>`

		const talks = /* html */ `
			<section class="section space-y-6">
				${heading("Talks", { as: "h2", class: "heading-2" })}
				<p>
					I really enjoy speaking at conferences.<br />
					I'm thankful for them to have me.
				</p>
				<p>
					Check out my past talks for resources, slides, and more -^
				</p>
				<ul role="list">
					${context.data.talks
						.map((talk) => {
							return /* html */ `
								<li class="flex gap-2">
									<time datetime="${talk.date}" class="ff-numeric">
										${dateToUSDate(talk.date)}
									</time>
									<a href="/talks/${talk.conference.slug}/${
										talk.slug
									}" class="lowercase underline">
										${talk.title}
									</a>
								</li>`
						})
						.join("\n")}
				</ul>
			</section>`

		const projects = /* html */ `
			<section class="section space-y-6">
				${heading("Projects", { as: "h2", class: "heading-2" })}
				<p>
					I create an maintain different code projects during my free time.
				</p>
				<p>
					Here's a list of them, dates refer to first release -^
				</p>
				<ul role="list">
					${Object.values(context.data.projects)
						.reverse()
						.map((project) => {
							return /* html */ `
								<li class="flex gap-2">
									<time datetime="${project.start}" class="ff-numeric">
									${dateToUSDate(project.start)}
									</time>
									<a href="${
										project.url
									}" target="_blank" rel="noreferrer" class="lowercase underline">
										${project.title}
									</a>
								</li>`
						})
						.join("\n")}
				</ul>
			</section>`

		const art = /* html */ `
			<section class="section space-y-6">
				${heading("Art", { as: "h2", class: "heading-2" })}
				<p>
					I share now and then artists' work.<br />
					Their work is really inspiring to me.
				</p>
				<p>
					If you'd like an artist to be shared here, or if you're one,
					<a href="/contact" class="underline">let me know</a>~
				</p>
				<p>
					Your can <a href="/art"><span class="underline">browse all entries there</span> -></a>
				</p>
			</section>`

		const formattedPosts = context.data.posts.map((post) => {
			return /* html */ `
					<li class="flex gap-2">
						<time datetime="${post.data.published_date}" class="ff-numeric">
							${dateToUSDate(post.data.published_date)}
						</time>
						<a href="${
							post.url
						}" class="lowercase underline ${post.data.theme.toLowerCase()}">
							${prismic.asText(post.data.title)}
						</a>
					</li>`
		})

		const posts = /* html */ `
			<section class="section space-y-6">
				${heading("Posts", { as: "h2", class: "heading-2" })}
				<p>
					I don't really write anymore.<br />
					I went through tech stuff, tutorials, and experience feedback.
				</p>
				<p>
					Here's an archive of my old posts -^
				</p>
				<ul role="list">
					${formattedPosts.join("\n")}
				</ul>
			</section>`

		return base(
			[
				announcement,
				hero,
				nav({ currentPath: context.path }),
				talks,
				projects,
				art,
				posts,
				footer(),
			].join("\n"),
			{ path: context.path, script: "/assets/js/index.ts" },
		)
	},
})
