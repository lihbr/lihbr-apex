const ALIGNMENTS = ["left", "center", "right"]

export function applyAlignment(alignment: string): void {
	document.documentElement.classList.add(alignment)
	document.documentElement.classList.remove(
		...ALIGNMENTS.filter((a) => a !== alignment),
	)
}

export function setAlignment(event: Event): void {
	event.preventDefault()

	const alignment =
		event.target instanceof HTMLElement && event.target.dataset.alignment

	if (alignment && ALIGNMENTS.includes(alignment)) {
		localStorage.alignment = alignment
		applyAlignment(alignment)
	}
}
