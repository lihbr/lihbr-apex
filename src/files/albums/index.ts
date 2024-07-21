import { defineAkteFile } from "akte"

import type { GlobalData } from "../../akte/types"

import { heading } from "../../components/heading"

import { minimal } from "../../layouts/minimal"

export const index = defineAkteFile<GlobalData>().from({
	path: "/albums",
	render(context) {
		const slot = /* html */ `
			<header class="section space-y-6">
				${heading("Albums", { as: "h1", class: "heading-1" })}
				<p>
					Aligned with <a href="/art" class="underline">my interest in art</a>, I'm into photography. Particularly street and landscape photography.
				</p>
				<p>
					Admitedly a recent hobby, I've been enjoying taking pictures with various cameras, from Y2K phones to modern mirrorless cameras.
				</p>
				<p>
					Albums are private. Find below the ones you've been granted access to -^
				</p>
			</header>
			<article class="section space-y-6"></article>
			`

		return minimal(slot, { path: context.path, title: "Albums", script: "/assets/js/albums.ts" })
	},
})
