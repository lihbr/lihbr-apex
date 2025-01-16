import type { VFile } from "vfile"

import rehypeAutolinkHeadings from "rehype-autolink-headings"
import rehypeExternalLinks from "rehype-external-links"
import rehypeSlug from "rehype-slug"
import rehypeStringify from "rehype-stringify"
import remarkFrontmatter from "remark-frontmatter"
import remarkGfm from "remark-gfm"
import remarkParse from "remark-parse"

import remarkRehype from "remark-rehype"
import remarkWikiLink from "remark-wiki-link"
import { type Plugin, type Processor, unified } from "unified"
import { visit } from "unist-util-visit"

import { matter } from "vfile-matter"
// @ts-expect-error - Missing types
import type { Code as MDCode, Parent as MDParent, Root as MDRoot } from "mdast"

import { slugify } from "../slufigy"
import { highlightCode, parseMarkdownCodeBlock } from "./highlightCode"

const remarkHighlightCode: Plugin<[], MDRoot> = () => {
	return async (tree) => {
		const promises: Promise<void>[] = []

		const highlightCodeAndReplace = async (
			node: MDCode,
			index: number,
			parent: MDParent,
		): Promise<void> => {
			const value = await highlightCode(
				parseMarkdownCodeBlock(`/${node.lang} ${node.meta || ""}/\n${node.value}`),
			)

			parent.children.splice(index, 1, { type: "html", value })
		}

		visit(tree, (node, index, parent) => {
			if (!parent || index === null) {
				return
			}

			switch (node.type) {
				case "code":
					promises.push(highlightCodeAndReplace(node, index || 0, parent))
					break

				case "inlineCode":
					node.data = { hProperties: { className: "inline" } }
					break
			}
		})

		await Promise.all(promises)
	}
}

const remarkExtendedWikiLink: Plugin<[], MDRoot> = () => {
	return async (tree, file) => {
		const outboundLinks: Record<string, true> = {}

		visit(tree, (node: any, index, parent) => {
			if (!parent || index === null || node.type !== "wikiLink") {
				return
			}

			delete node.data.hProperties.className

			const url = `/${slugify(node.value)}`
			const value = node.data.alias.split("/").pop()

			parent.children.splice(index, 1, {
				type: "link",
				url,
				children: [{ type: "text", value }],
			})

			outboundLinks[url] = true
		})

		file.data.links = {
			outbound: Object.keys(outboundLinks),
		}
	}
}

let processor: Processor<any, any, any, any, string>

export async function markdownToHTML<TMatter extends Record<string, unknown>>(markdown: string): Promise<{
	matter: TMatter
	links: {
		outbound: string[]
	}
	html: string
}> {
	if (!processor) {
		processor = unified()
			// Parse string
			.use(remarkParse)
			// GitHub MarkDown
			.use(remarkGfm)
			// Frontmatter
			.use(remarkFrontmatter, ["yaml"])
			.use(() => (_tree: MDRoot, file: VFile) => {
				matter(file)
			})
			// Wiki links
			.use(remarkWikiLink, { aliasDivider: "|" })
			.use(remarkExtendedWikiLink)
			// Highlight code
			// @ts-expect-error - Missing types
			.use(remarkHighlightCode)
			.use(remarkRehype, { allowDangerousHtml: true })
			.use(rehypeExternalLinks, {
				rel: ["noreferrer"],
				target: "_blank",
			})
			.use(rehypeSlug)
			.use(rehypeAutolinkHeadings, { behavior: "wrap" })
			.use(rehypeStringify, { allowDangerousHtml: true })
	}

	const virtualFile = await processor.process(markdown)

	return {
		matter: virtualFile.data.matter as TMatter,
		links: virtualFile.data.links as {
			outbound: string[]
		},
		html: virtualFile.toString(),
	}
}
