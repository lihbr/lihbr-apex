import { defineAkteFile } from "akte";

import type { GlobalData } from "../akte/types";

import { heading } from "../components/heading";

import { minimal } from "../layouts/minimal";

export const fourOFour = defineAkteFile<GlobalData>().from({
	path: "/404",
	render(context) {
		const slot = /* html */ `
			<header class="section space-y-6">
				${heading("Page Not Found", { as: "h1", class: "heading-1" })}
				<p>
					This page does not exists.
				</p>
			</header>`;

		return minimal(slot, { path: context.path, title: "404" });
	},
});
