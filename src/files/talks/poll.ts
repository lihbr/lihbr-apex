import { defineAkteFile } from "akte"

import type { GlobalData } from "../../akte/types"

import { heading } from "../../components/heading"

import { minimal } from "../../layouts/minimal"

export const poll = defineAkteFile<GlobalData>().from({
	path: "/talks/poll",
	render(context) {
		const slot = /* html */ `
			<header class="section space-y-6">
				${heading("Poll", { as: "h1", class: "heading-1" })}
				<p>
					Thanks for voting, your answer has been recorded.
				</p>
				<p>
					Other questions might be up soon, stay tuned!
				</p>
			</header>`

		return minimal(slot, { path: context.path, title: "Poll" })
	},
})
