import { HTMLMapSerializer } from "@prismicio/client";
import { slugify } from "../lib/slufigy";

type ArgsFor<TNode extends keyof HTMLMapSerializer> = Parameters<
	Required<HTMLMapSerializer>[TNode]
>[0];

// Transform inline nodes
const inline = (children: string): string => {
	return children.replace(/`(.*?)`/g, '<code class="inline">$1</code>');
};

// Transform block nodes
const _block = (children: string): string => {
	return children;
};

const heading = (
	args: ArgsFor<
		"heading1" | "heading2" | "heading3" | "heading4" | "heading5" | "heading6"
	>,
): string => {
	const level = args.type.replace("heading", "");
	const slug = slugify(args.node.text);

	const anchorOpenTag = `<a href="#${slug}" title="Permalink to ${args.node.text}" class="hocus:after:content-['_#'] hocus:underline">`;
	const anchorCloseTag = "</a>";

	// Marking sure to not nest anchor tags inside heading
	const children = inline(args.children).replace(
		/(<(a)\b[^>]*>(.*?)<\/(a)>)/g,
		`${anchorCloseTag}$1${anchorOpenTag}`,
	);

	return `<h${level} class="heading-${level}" id="${slug}">
	${anchorOpenTag}${children}${anchorCloseTag}
</h${level}>`;
};

export const htmlSerializer: HTMLMapSerializer = {
	preformatted: (node) => node.text,
	heading1: heading,
	heading2: heading,
	heading3: heading,
	heading4: heading,
	heading5: heading,
	heading6: heading,
};
