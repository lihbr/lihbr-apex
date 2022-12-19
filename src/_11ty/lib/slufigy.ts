import _slufigy from "slugify";

export const slugify = (value: string): string => {
	return _slufigy(value, {
		replacement: "-",
		remove: /[*+~()`'"!?:;,.@°_]/g,
		lower: true,
	});
};
