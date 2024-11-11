import type { GlobalData } from "../../akte/types"

import { defineAkteFile } from "akte"

import { heading } from "../../components/heading"

import { page } from "../../layouts/page"

export const index = defineAkteFile<GlobalData>().from({
	path: "/contact",
	render(context) {
		const hero = /* html */ `
			<header class="section space-y-6">
				${heading("Contact", { as: "h1", class: "heading-1" })}
				<p>
					This page is here if you want to contact me.
				</p>
				<p>
					You can use it to share artists you like with me, send feedback of all sort, make inquiries, etc. I'll do my best to get back to you if need be.
				</p>
			</header>`

		const preferred = /* html */ `
			<section class="section space-y-6">
				${heading("Preferred methods", { as: "h2", class: "heading-2" })}
				<p>
					Before you jump straight to the form below, please be aware that you can also contact me via the following means and platforms.
				</p>
				<ul class="list-disc list-inside">
					<li>
						<a href="mailto:hello@lihbr.com" class="lowercase underline">Mail</a>
					</li>
					<li>
						<a href="https://bsky.app/profile/lihbr.com" class="lowercase underline" target="_blank" rel="noopener noreferrer">Bluesky</a>
					</li>
					<li>
						<a href="https://twitter/li_hbr" class="lowercase underline" target="_blank" rel="noopener noreferrer">Twitter</a>
					</li>
					<li>
						<a href="https://mastodon.social/@lihbr" class="lowercase underline" target="_blank" rel="noopener noreferrer">Mastodon</a>
					</li>
					<li>
						<a href="https://www.linkedin.com/in/lucie-haberer" class="lowercase underline" target="_blank" rel="noopener noreferrer">LinkedIn</a>
					</li>
				</ul>
			</section>`

		const form = /* html */ `
			<section class="section space-y-6">
				${heading("Form", { as: "h2", class: "heading-2" })}
				<form id="contact" class="form space-y-6" action="/api/contact" method="POST">
				<div class="space-y-2">
					<label for="from">From</label>
					<input id="from" name="from" type="email" placeholder="clorinde@example.com" maxlength="256" required />
				</div>
				<div class="space-y-2 sr-only" tabindex="-1">
					<label for="not-a-robot" tabindex="-1">Not a robot</label>
					<input type="checkbox" id="not-a-robot" name="notARobot" tabindex="-1" />
				</div>
				<div class="space-y-2">
					<label for="message">Message</label>
					<textarea id="message" name="message" rows="8" class="resize-y min-h-[13.25rem]" placeholder="Hi Lucie, I'd like to..." minlength="7" maxlength="2048" required></textarea>
					<button type="submit" class="lowercase"><span class="underline">Send</span> -></button>
				</div>
				</form>
			</section>`

		return page([hero, preferred, form].join("\n"), {
			path: context.path,
			title: "Contact",
		})
	},
})
