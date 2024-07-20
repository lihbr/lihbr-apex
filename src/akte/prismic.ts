import process from "node:process"

import * as prismic from "@prismicio/client"
import fetch from "node-fetch"

import { highlightCode, parseMarkdownCodeBlock } from "./lib/highlightCode"

import { slugify } from "./slufigy"

type ArgsFor<TNode extends keyof prismic.HTMLRichTextMapSerializer> = Parameters<
	Extract<Required<prismic.HTMLRichTextMapSerializer>[TNode], (...args: any) => any>
>[0]

// Transform inline nodes
function inline(children: string): string {
	return children.replace(/`(.*?)`/g, "<code class=\"inline\">$1</code>")
}

// Transform block nodes
function block(tag: string, children: string): string {
	return `<${tag}>${inline(children)}</${tag}>`
}

function heading(args: ArgsFor<
		"heading1" | "heading2" | "heading3" | "heading4" | "heading5" | "heading6"
	>): string {
	const level = args.type.replace("heading", "")
	const slug = slugify(args.node.text)

	const anchorOpenTag = `<a href="#${slug}" title="Permalink to ${args.node.text}" class="hocus:after:content-['_#'] hocus:underline">`
	const anchorCloseTag = "</a>"

	// Marking sure to not nest anchor tags inside heading
	const children = inline(args.children).replace(
		/(<(a)\b[^>]*>(.*?)<\/(a)>)/g,
		`${anchorCloseTag}$1${anchorOpenTag}`,
	)

	return `<h${level} id="${slug}">
	${anchorOpenTag}${children}${anchorCloseTag}
</h${level}>`
}

export const htmlSerializer: prismic.HTMLMapSerializer = {
	heading1: heading,
	heading2: heading,
	heading3: heading,
	heading4: heading,
	heading5: heading,
	heading6: heading,
	paragraph: (args) => {
		if (args.children.match(/^(>|&gt;)\s*/)) {
			return block("blockquote", args.children.replace(/^(>|&gt;)\s*/, ""))
		}

		return block("p", args.children)
	},
	preformatted: (args) => args.text,
	listItem: (args) => block("li", args.children),
	oListItem: (args) => block("li", args.children),
	hyperlink: (args) => {
		const url = prismic.asLink(args.node.data)

		if (!url) {
			throw new Error(
				`Failed to resolve URL for link: ${JSON.stringify(args.node.data)}`,
			)
		}

		const target =
			args.node.data.link_type === "Web" && args.node.data.target
				? ` target="_blank" rel="noopener noreferrer"`
				: ""

		const classes =
			args.children.startsWith("_") && args.children.endsWith("_")
				? ` class="lowercase"`
				: ""

		const children = inline(args.children.replace(/_(.*?)_/g, "$1"))

		return `<a href="${url}"${target}${classes}>${children}</a>`
	},
}

export function asHTML(richText: prismic.RichTextField): string {
	return prismic.asHTML(richText, null, htmlSerializer)
}

export async function asyncAsHTML(richText: prismic.RichTextField): Promise<string> {
	// Prepare nodes
	const prepared = (await Promise.all<prismic.RTNode>(
		richText.map((node) => {
			switch (node.type) {
				case "preformatted":
					return (async () => {
						return {
							...node,
							text: await highlightCode(parseMarkdownCodeBlock(node.text)),
						}
					})()

				default:
					return node
			}
		}),
	)) as unknown as prismic.RichTextField

	return asHTML(prepared)
}

let CLIENT: prismic.Client
export function getClient(): prismic.Client {
	if (!CLIENT) {
		CLIENT = prismic.createClient(process.env.PRISMIC_ENDPOINT || "", {
			fetch,
			accessToken: process.env.PRISMIC_TOKEN,
			brokenRoute: "/404",
			routes: [
				{
					path: "/posts/:uid",
					type: "post__blog",
				},
				{
					path: "/:uid",
					type: "post__document",
				},
				{
					path: "/private/:uid",
					type: "post__document--private",
				},
				{
					path: "/art",
					type: "post__art",
				},
				{
					path: "/albums/:uid",
					type: "post__album",
				},
			],
		})
	}

	return CLIENT
}

const REPOSITORY = process.env.PRISMIC_ENDPOINT ? new URL(process.env.PRISMIC_ENDPOINT).hostname.split(".")[0] : ""

async function getImageTags(): Promise<Record<string, string>> {
	const res = await fetch("https://asset-api.prismic.io/tags", {
		headers: {
			repository: REPOSITORY,
			authorization: `Bearer ${process.env.PRISMIC_WRITE_TOKEN}`,
		},
	})

	if (!res.ok) {
		throw new Error(`Failed to fetch image tags: ${res.statusText}`)
	}

	const { items } = await res.json() as { items: { id: string, name: string }[] }

	const tags: Record<string, string> = {}

	for (const item of items) {
		tags[item.name] = item.id
	}

	return tags
}

export async function getImages(args: {
	tags?: string[]
	resolvedTags?: string[]
	cursor?: string
}): Promise<prismic.ImageFieldImage[]> {
	const url = new URL("https://asset-api.prismic.io/assets")

	url.searchParams.set("assetType", "image")
	url.searchParams.set("limit", "1000")
	url.searchParams.set("origin", "https://lihbr.com")

	let resolvedTags: string[] = args.resolvedTags || []
	if (args.tags) {
		const imageTags = await getImageTags()

		resolvedTags = args.tags.map((tag) => imageTags[tag])
	}

	if (resolvedTags.length) {
		url.searchParams.set("tags", resolvedTags.join(","))
	}

	if (args.cursor) {
		url.searchParams.set("cursor", args.cursor)
	}

	const res = await fetch(url, {
		headers: {
			repository: REPOSITORY,
			authorization: `Bearer ${process.env.PRISMIC_WRITE_TOKEN}`,
		},
	})

	if (!res.ok) {
		throw new Error(`Failed to fetch images: ${res.statusText}`)
	}

	const { items, cursor } = await res.json() as {
		items: {
			id: string
			url: string
			filename: string
			alt: string
			credits: string
			width: number
			height: number
		}[]
		cursor: string
	}

	const images: prismic.ImageFieldImage[] = items.sort((a, b) => a.filename.localeCompare(b.filename)).map((item) => ({
		id: item.id,
		url: item.url,
		alt: item.alt,
		copyright: item.credits,
		dimensions: { width: item.width, height: item.height },
		edit: { x: 0, y: 0, zoom: 1, background: "transparent" },
	}))

	if (images.length >= 1000) {
		await new Promise((resolve) => setTimeout(resolve, 2000))

		return [
			...images,
			...(await getImages({ resolvedTags, cursor })),
		]
	}

	return images
}
