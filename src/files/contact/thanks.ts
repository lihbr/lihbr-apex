import { defineAkteFile } from "akte";

import type { GlobalData } from "../../akte/types";

import { heading } from "../../components/heading";

import { minimal } from "../../layouts/minimal";

export const thanks = defineAkteFile<GlobalData>().from({
	path: "/contact/thanks",
	render(context) {
		const slot = /* html */ `
			<header class="section space-y-6">
				${heading("Contact", { as: "h1", class: "heading-1" })}
				<p>
					Thanks for contacting me. I have received your message.
				</p>
				<p>
					If your message requires an answer, I'll do my best to get back to you within a reasonable delay.
				</p>
			</header>`;

		return minimal(slot, { path: context.path, title: "Contact" });
	},
});
