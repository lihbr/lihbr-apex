import _slufigy from "slugify";

export function slugify(value: string): string {
	return _slufigy(value, {
		replacement: "-",
		remove: /[*+~()`'"!?:;,.@°_]/g,
		lower: true,
	});
}
