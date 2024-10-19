import { usePoliteViewTransition } from "./usePoliteViewTransition"

function isDark(): boolean {
	return (
		localStorage.theme === "dark" ||
		(!("theme" in localStorage) &&
			window.matchMedia("(prefers-color-scheme: dark)").matches)
	)
}

export function applyTheme(): void {
	if (isDark()) {
		document.documentElement.classList.add("dark")
	} else {
		document.documentElement.classList.remove("dark")
	}
}

export function toggleTheme(event: Event): void {
	event.preventDefault()

	if (!isDark()) {
		localStorage.theme = "dark"
	} else {
		localStorage.theme = "light"
	}

	usePoliteViewTransition(applyTheme)
}
