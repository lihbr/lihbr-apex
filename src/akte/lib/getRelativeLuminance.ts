/** @see https://www.w3.org/TR/WCAG20/#relativeluminancedef */
export function getRelativeLuminance(hex: string): number {
	const maybeMatch = hex.match(/^#(?<r>\w{2})(?<g>\w{2})(?<b>\w{2})$/);

	if (!maybeMatch || !maybeMatch.groups) {
		throw new Error(
			`Provided value is not a valid HEX color string: \`${hex}\``,
		);
	}

	const r8 = Number.parseInt(maybeMatch.groups.r, 16);
	const g8 = Number.parseInt(maybeMatch.groups.g, 16);
	const b8 = Number.parseInt(maybeMatch.groups.b, 16);

	const tweak = (value: number): number => {
		const sRGB = value / 255;

		if (sRGB <= 0.03928) {
			return sRGB / 12.92;
		} else {
			return ((sRGB + 0.055) / 1.055) ** 2.4;
		}
	};

	return 0.2126 * tweak(r8) + 0.7152 * tweak(g8) + 0.0722 * tweak(b8);
}
