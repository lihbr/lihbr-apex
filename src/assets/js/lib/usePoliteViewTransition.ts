import { prefersReducedMotion } from "./prefersReducedMotion"

export async function usePoliteViewTransition(callback: () => unknown): Promise<void> {
	if (prefersReducedMotion || !("startViewTransition" in document)) {
		callback()
	} else {
		const transition = document.startViewTransition(() => {
			callback()
		})

		await transition.finished
	}
}
