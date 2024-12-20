import JSConfetti from "js-confetti"

import { lcFirst } from "./lib/lcFirst"
import { prefersReducedMotion } from "./lib/prefersReducedMotion"
import "./_base"

const referred = document.location.search.includes("source=conference")

if (referred) {
	const $referred = document.querySelector<HTMLElement>("figure#referred")

	if ($referred) {
		$referred.classList.remove("hidden")

		if (!prefersReducedMotion) {
			const confetti = $referred.dataset.confetti
			if (confetti) {
				new JSConfetti().addConfetti({
					emojis: confetti.split(","),
					emojiSize: 80,
				})
			}
		}
	}
}

const $form = document.querySelector<HTMLFormElement>("form#feedback")

if ($form) {
	$form.addEventListener("submit", (e) => {
		e.preventDefault()

		const values: Record<string, string> = Object.fromEntries(
			// @ts-expect-error - `FormData.entries()` exists, see https://developer.mozilla.org/en-US/docs/Web/API/FormData/entries#browser_compatibility
			new FormData($form).entries(),
		)

		const url = `https://twitter.com/intent/tweet?hashtags=${
			values.hashtags
		}&related=${values.related}&text=${encodeURIComponent(
			"Hey @li_hbr, ",
		)}${lcFirst(values.feedback)}`

		window.open(url, "_blank")?.focus()
	})
}
