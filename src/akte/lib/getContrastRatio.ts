/** @see https://www.w3.org/TR/WCAG20/#contrast-ratiodef */
export function getContrastRatio(l1: number, l2: number): number {
	if (l1 > l2) {
		return (l1 + 0.05) / (l2 + 0.05);
	} else {
		return (l2 + 0.05) / (l1 + 0.05);
	}
}
