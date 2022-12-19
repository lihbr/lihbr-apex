import { HTMLMapSerializer, asLink } from "@prismicio/client";

import { slugify } from "../lib/slufigy";
import { linkResolver } from "./linkResolver";

type ArgsFor<TNode extends keyof HTMLMapSerializer> = Parameters<
	Required<HTMLMapSerializer>[TNode]
>[0];

// Transform inline nodes
const inline = (children: string): string => {
	return children.replace(/`(.*?)`/g, '<code class="inline">$1</code>');
};

// Transform block nodes
const block = (tag: string, children: string): string => {
	return `<${tag}>${inline(children)}</${tag}>`;
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

	return `<h${level} id="${slug}">
	${anchorOpenTag}${children}${anchorCloseTag}
</h${level}>`;
};

export const htmlSerializer: HTMLMapSerializer = {
	heading1: heading,
	heading2: heading,
	heading3: heading,
	heading4: heading,
	heading5: heading,
	heading6: heading,
	paragraph: (args) => {
		if (args.children.match(/^(>|&gt;)\s*/)) {
			return block("blockquote", args.children.replace(/^(>|&gt;)\s*/, ""));
		}

		return block("p", args.children);
	},
	preformatted: (args) => args.text,
	listItem: (args) => block("li", args.children),
	oListItem: (args) => block("li", args.children),
	hyperlink: (args) => {
		const url = asLink(args.node.data, linkResolver);

		if (!url) {
			throw new Error(
				`Failed to resolve URL for link: ${JSON.stringify(args.node.data)}`,
			);
		}

		const target =
			args.node.data.link_type === "Web" && args.node.data.target
				? ` target="blank" rel="noopener noreferrer"`
				: "";

		return `<a href="${url}"${target}>${inline(args.children)}</a>`;
	},
};
