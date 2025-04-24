import { NETLIFY } from "../akte/constants"
import { heading } from "./heading"

export function footer(): string {
	return /* html */ `
		<footer class="section space-y-6 mb-16">
			${heading("Footer", { as: "h2", class: "heading-2 !text-inherit" })}
			<p>
				This place is a collection of things I make, produce, or enjoy.<br />
				They are meant to be shared with friends, students, and digital people.
			</p>
			<p>
				Most of my work is open-source on <a href="https://github.com/lihbr" target="_blank" rel="noreferrer" class="underline" title="Permalink to Lucie's GitHub">GitHub</a><br />
				You can support it through <a href="https://github.com/sponsors/lihbr" target="_blank" rel="noreferrer" class="underline" title="Permalink to Lucie's GitHub Sponsors page">GitHub Sponsors</a>
			</p>
			<p>
				Read more and chat with me on <a href="https://bsky.app/profile/lihbr.com" target="_blank" rel="noreferrer" class="underline" title="Permalink to Lucie's Bluesky">Bluesky</a>, <a href="https://www.instagram.com/lihbr.png" target="_blank" rel="noreferrer" class="underline" title="Permalink to Lucie's Instagram">Instagram</a>, or <a href="https://mastodon.social/@lihbr" target="_blank" rel="noreferrer" class="underline" title="Permalink to Lucie's Mastodon">Mastodon</a><br />
				To contact me, here's a <a href="mailto:hello@lihbr.com" class="underline" title="Write an email to Lucie">mail</a> and a <a href="/contact" class="underline">contact page</a>.
			</p>
			<br />
			<p>
				<a href="/terms" class="underline">terms</a>, <a href="/privacy" class="underline">privacy</a>
			</p>
			<p>
				commit ref: <a
					href="${NETLIFY.commitURL}"
					target="_blank"
					rel="noreferrer"
					class="underline"
					title="Permalink to this build commit">${NETLIFY.commitRefShort}</a><br />
				<a href="https://creativecommons.org/licenses/by-nc-sa/4.0" target="_blank" rel="noreferrer" class="underline">cc by-nc-sa 4.0</a> © 2020-present lucie haberer
			</p>
		</footer>`
}
