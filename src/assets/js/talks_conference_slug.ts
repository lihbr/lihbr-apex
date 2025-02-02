import JSConfetti from "js-confetti"

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
