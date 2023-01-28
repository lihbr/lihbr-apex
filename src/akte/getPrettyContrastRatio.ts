import { getContrastRatio } from "./lib/getContrastRatio";
import { getRelativeLuminance } from "./lib/getRelativeLuminance";

export const getPrettyContrastRatio = (
	foreground: string,
	background: string,
	precision = 2,
): string => {
	return getContrastRatio(
		getRelativeLuminance(foreground),
		getRelativeLuminance(background),
	)
		.toFixed(precision)
		.replace(/\.?0+$/, "");
};
