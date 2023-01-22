import { defineAkteFile } from "akte";
import * as prismic from "@prismicio/client";

import { readAllDataJSON } from "../akte/data";
import { getClient } from "../akte/prismic";
import { dateToUSFormat } from "../akte/date";
import type { GlobalData, ProjectData, TalkData } from "../akte/types";

import { footer } from "../components/footer";
import { heading } from "../components/heading";
import { nav } from "../components/nav";

import { base } from "../layouts/base";

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
		] as const;

		const [talks, posts, projects] = await Promise.all(promises);

		return {
			talks,
			posts,
			projects,
		};
	},
	render(context) {
		const hero = /* html */ `
			<main class="section space-y-6">
				${heading("Hi! Lucie here", { as: "h1", class: "heading-0" })}
				<p>
					I'm an internet citizen, currently working as a
					DevExp Engineer <a href="https://prismic.io" target="_blank" rel="noopener noreferrer" class="underline">@prismicio</a>
					<br />
					I'm also a contributor and team member <a href="https://nuxt.com" target="_blank" rel="noopener noreferrer" class="underline">@nuxt_js</a>,
					enjoying open-source overall.
					<br />
					Learn more about me and this place on <a href="/about" class="underline">the about page</a>,
					or appreciate the following~
				</p>
			</main>`;

		const talks = /* html */ `
			<section class="section space-y-6">
				${heading("Talks", { as: "h2", class: "heading-2" })}
				<p>
					I'm speaking, and had the opportunity to, at a few conferences.
				</p>
				<p>
					Check out my past talks for resources, slides, and more -^
				</p>
				<ul role="list">
					${Object.values(context.data.talks)
						.reverse()
						.map((talk) => {
							return /* html */ `
								<li class="flex gap-2">
									<time datetime="${talk.date}" class="ff-numeric">
										${dateToUSFormat(talk.date)}
									</time>
									<a href="/talks/${talk.conference.slug}/${
								talk.slug
							}" class="lowercase underline">
										${talk.title}
									</a>
								</li>`;
						})
						.join("\n")}
				</ul>
			</section>`;

		const formattedPosts = context.data.posts.map((post) => {
			return /* html */ `
				<li class="flex gap-2">
					<time datetime="${post.data.published_date}" class="ff-numeric">
						${dateToUSFormat(post.data.published_date)}
					</time>
					<a href="${
						post.url
						// TODO: Refactor theme to "select" in Prismic
					}" class="lowercase underline">
						${prismic.asText(post.data.title)}
					</a>
				</li>`;
		});

		const posts = /* html */ `
			<section class="section space-y-6">
				${heading("Posts", { as: "h2", class: "heading-2" })}
				<p>
					I write on a quite irregular basis.<br />
					I go through tech stuff, tutorials, and experience feedback.
				</p>
				<p>
					Have a read at the most recent posts -^
				</p>
				<ul role="list">
					${formattedPosts.slice(0, 3).join("\n")}
				</ul>
				<details>
					<summary class="action inline cursor-pointer">
						<span class="underline">...or browse archives</span> <span class="open:hidden">-></span><span class="hidden open:inline">-^</span>
					</summary>
					<ul class="mt-6" role="list">
						${formattedPosts.slice(3).join("\n")}
					</ul>
				</details>
			</section>`;

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
					Your can also <a href="/art"><span class="underline">browse all entries there</span> -></a>
				</p>
			</section>`;

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
									${dateToUSFormat(project.start)}
									</time>
									<a href="${
										project.url
									}" target="_blank" rel="noopener noreferrer" class="lowercase underline">
										${project.title}
									</a>
								</li>`;
						})
						.join("\n")}
				</ul>
			</section>`;

		return base(
			[
				hero,
				nav({ currentPath: context.path }),
				talks,
				posts,
				art,
				projects,
				footer(),
			].join("\n"),
			{ path: context.path },
		);
	},
});
