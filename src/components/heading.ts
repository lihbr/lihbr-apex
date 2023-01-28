import { slugify } from "../akte/slufigy";

export const heading = (
	slot: string,
	args: { as: string; class?: string },
): string => {
	const as = args.as;
	const classes = args.class ? ` class="${args.class}"` : "";
	const id = slugify(slot);

	return /* html */ `
		<${as}${classes} id="${id}">
			<a
				href="#${id}"
				title="Permalink to ${slot}"
				class="hocus:after:content-['_#'] hocus:underline"
			>${slot}</a>
		</${as}>`;
};
