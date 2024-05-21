import { defineAkteFile } from "akte"

import type { GlobalData } from "../akte/types"

import { heading } from "../components/heading"

import { minimal } from "../layouts/minimal"

export const preview = defineAkteFile<GlobalData>().from({
	path: "/preview",
	render(context) {
		const slot = /* html */ `
			<header class="section space-y-6">
				${heading("Loading Preview", { as: "h1", class: "heading-1" })}
				<p>
					Hang on a little while...
				</p>
			</header>`

		return minimal(slot, { path: context.path, title: "Loading Preview" })
	},
})
