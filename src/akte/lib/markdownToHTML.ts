import { type Plugin, type Processor, unified } from "unified";

import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
// @ts-expect-error - No declaration
import remarkWikiLink from "remark-wiki-link";
import remarkFrontmatter from "remark-frontmatter";
import type { VFile } from "vfile";
import { matter } from "vfile-matter";
import remarkRehype from "remark-rehype";

import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeStringify from "rehype-stringify";

import { visit } from "unist-util-visit";
import type { Code as MDCode, Parent as MDParent, Root as MDRoot } from "mdast";

import { slugify } from "../slufigy";
import { highlightCode, parseMarkdownCodeBlock } from "./highlightCode";

const remarkHighlightCode: Plugin<[], MDRoot> = () => {
	return async (tree) => {
		const promises: Promise<void>[] = [];

		const highlightCodeAndReplace = async (
			node: MDCode,
			index: number,
			parent: MDParent,
		): Promise<void> => {
			const value = await highlightCode(
				parseMarkdownCodeBlock(`/${node.lang}/\n${node.value}`),
			);

			parent.children.splice(index, 1, { type: "html", value });
		};

		visit(tree, (node, index, parent) => {
			if (!parent || index === null) {
				return;
			}

			switch (node.type) {
				case "code":
					promises.push(highlightCodeAndReplace(node, index, parent));
					break;

				case "inlineCode":
					node.data = { hProperties: { className: "inline" } };
					break;
			}
		});

		await Promise.all(promises);
	};
};

const remarkExtendedWikiLink: Plugin<[], MDRoot> = () => {
	return async (tree, file) => {
		const outboundLinks: Record<string, true> = {};

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		visit(tree, (node: any, index, parent) => {
			if (!parent || index === null || node.type !== "wikiLink") {
				return;
			}

			delete node.data.hProperties.className;

			const url = `/${slugify(node.value)}`;
			const value = node.value.split("/").pop();

			parent.children.splice(index, 1, {
				type: "link",
				url,
				children: [{ type: "text", value }],
			});

			outboundLinks[url] = true;
		});

		file.data.links = {
			outbound: Object.keys(outboundLinks),
		};
	};
};

let processor: Processor;

export const markdownToHTML = async <TMatter extends Record<string, unknown>>(
	markdown: string,
): Promise<{
	matter: TMatter;
	links: {
		outbound: string[];
	};
	html: string;
}> => {
	if (!processor) {
		processor = unified()
			// Parse string
			.use(remarkParse)
			// GitHub MarkDown
			.use(remarkGfm)
			// Frontmatter
			.use(remarkFrontmatter, ["yaml"])
			.use(() => (_tree: MDRoot, file: VFile) => {
				matter(file);
			})
			// Wiki links
			.use(remarkWikiLink)
			.use(remarkExtendedWikiLink)
			// Highlight code
			.use(remarkHighlightCode)
			.use(remarkRehype, { allowDangerousHtml: true })
			.use(rehypeSlug)
			.use(rehypeAutolinkHeadings, { behavior: "wrap" })
			.use(rehypeStringify, { allowDangerousHtml: true });
	}

	const virtualFile = await processor.process(markdown);

	return {
		matter: virtualFile.data.matter as TMatter,
		links: virtualFile.data.links as {
			outbound: string[];
		},
		html: virtualFile.toString(),
	};
};
