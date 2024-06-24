import { prefersReducedMotion } from "./prefersReducedMotion"

export async function usePoliteViewTransition(callback: () => unknown): Promise<void> {
	if (prefersReducedMotion || !("startViewTransition" in document)) {
		callback()
	} else {
		// @ts-expect-error - startViewTransition is not yet in the TS types
		const transition = document.startViewTransition(() => {
			callback()
		})

		await transition.finished
	}
}
