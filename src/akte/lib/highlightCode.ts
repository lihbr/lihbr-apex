import {
	createStarryNight as _createStarryNight,
	common,
} from "@wooorm/starry-night"
import sourceRust from "@wooorm/starry-night/source.rust"
import sourceTOML from "@wooorm/starry-night/source.toml"
import sourceTSX from "@wooorm/starry-night/source.tsx"
import sourceVue from "@wooorm/starry-night/text.html.vue"

let STARRY_NIGHT: any
async function createStarryNight() {
	if (!STARRY_NIGHT) {
		STARRY_NIGHT = await _createStarryNight([
			...common,
			sourceTSX,
			sourceVue,
			sourceRust,
			sourceTOML,
		])
	}

	return STARRY_NIGHT
}

const PLAIN_TEXT = "plain-text"
const HTML_PREVIEW = "html-preview"

type HighlightCodeArgs = {
	/**
	 * Code to highlight
	 */
	code: string

	/**
	 * Language to highlight with
	 */
	language: string

	/**
	 * Filename to display
	 */
	filename: string | null

	/**
	 * Lines to highlight
	 */
	lineHighlights: number[][] | null
}

type ParseMarkdownCodeBlockReturnType = HighlightCodeArgs

/**
 * Parse line highlights string.
 *
 * @param raw - Line highlight string
 * @returns Parsed line highlights
 *
 * @example
 * parseLineHighlightsString("8-10,13"); // [[8, 10], [13, 13]]
 *
 * @remarks
 * Overlapping ranges are merged together.
 */
function parseLineHighlightsString(raw: string): number[][] {
	let lastEnd = 0

	return (
		raw
			// Remove all whitespaces
			.replace(/\s/g, "")
			// Split to array
			.split(",")
			// Parse ranges
			.map((range) => {
				const [start, end] = range.split("-").map((n) => Number.parseInt(n))

				return [start, end || start]
			})
			// Filter invalid inputs
			.filter(([start, end]) => !Number.isNaN(start) && !Number.isNaN(end) && start > 0)
			// Sort ranges
			.sort((a, b) => a[0] - b[0])
			// Normalize ranges
			.map(([start, end]) => {
				start = Math.max(start, lastEnd + 1)
				lastEnd = end

				return [start, end]
			})
			// Filter invalid ranges
			.filter(([start, end]) => start <= end)
	)
}

export function parseMarkdownCodeBlock(markdownCodeBlock: string): ParseMarkdownCodeBlockReturnType {
	const maybeMatch = markdownCodeBlock.match(
		/**
		 * @see https://regex101.com/r/gzGiA5/3
		 */
		/^\s*\/(?<language>[\w-]+)?\s?(?:\[(?<filename>[/\w\s.~-]*)\])?(?:\{(?<lineHighlightsString>[\s\d,-]*)\})?\s?\/(?<code>[\s\S]*)/,
	)

	if (!maybeMatch || !maybeMatch.groups) {
		return {
			code: markdownCodeBlock.trim(),
			language: PLAIN_TEXT,
			filename: null,
			lineHighlights: null,
		}
	}

	const groups = maybeMatch.groups as Partial<Record<string, string>>

	return {
		code: (groups.code || markdownCodeBlock).trim(),
		language: groups.language || PLAIN_TEXT,
		filename: groups.filename || null,
		lineHighlights: groups.lineHighlightsString
			? parseLineHighlightsString(groups.lineHighlightsString)
			: null,
	}
}

/**
 * Highlight code as plain text.
 *
 * @param code - Code to highlight
 * @returns Highlighted code
 *
 * @remarks
 * This function basically wraps each line of code in its own element.
 */
function highlightPlainText(code: string): string {
	return code
		.split(/\r?\n/)
		.map((line) => `<span class="token">${line}</span>`)
		.join("\n")
}

/**
 * Highlight code with Starry Night
 *
 * @param code - Code to highlight
 * @returns Highlighted code
 */
export async function highlightStarryNight(code: string,	language: string): Promise<string> {
	const starryNight = await createStarryNight()

	const maybeScope = starryNight.flagToScope(language)

	if (!maybeScope) {
		console.warn(
			`Unknown language \`${language}\`, highlighting as plain text.`,
		)

		return highlightPlainText(code)
	}

	const tree = starryNight.highlight(code, maybeScope)

	const { toHtml } = await import("hast-util-to-html")

	return toHtml(tree)
}

/**
 * Highlight lines in code.
 *
 * @param code - Code to highlight lines on
 * @param lineHighlights - Lines to highlight
 * @returns Code with highlighted lines
 */
function highlightLines(code: string,	lineHighlights: number[][] = []): string {
	if (!lineHighlights.length) {
		return code
	}

	const lineByLineCode: string[] = code.split(/\r?\n/)

	const prependStart = (index: number, isLineHighlight: boolean): void => {
		const className = isLineHighlight ? "hl-lh" : "hl-nlh"
		lineByLineCode[
			index
		] = `<span class="${className}"><span class="${className}w">${lineByLineCode[index]}`
	}
	const appendEnd = (index: number): void => {
		lineByLineCode[index] = `${lineByLineCode[index]}</span></span>`
	}

	// Opening non-highlight opening tag if necessary
	if (lineHighlights[0][0] > 1) {
		prependStart(0, false)
	}

	let minEnd = 0
	for (const [start, end] of lineHighlights) {
		if (start > lineByLineCode.length) {
			break
		}

		// Non-highlight closing tag
		if (start > 1) {
			appendEnd(start - 2)
		}

		// Highlight opening and closing tags
		prependStart(start - 1, true)
		minEnd = Math.min(end, lineByLineCode.length)
		appendEnd(minEnd - 1)

		// Non-highlight opening tag
		if (minEnd < lineByLineCode.length) {
			prependStart(minEnd, false)
		}
	}

	// Closing non-highlight closing tag if necessary
	if (minEnd < lineByLineCode.length) {
		appendEnd(lineByLineCode.length - 1)
	}

	return lineByLineCode.join("\n")
}

/**
 * Highlight given code.
 *
 * @param args - Code to highlight and options
 * @returns Highlighted code as HTML
 */
export async function highlightCode(args: HighlightCodeArgs): Promise<string> {
	let highlightedCode
	switch (args.language) {
		case HTML_PREVIEW:
			return `<figure>${args.code}</figure>`

		case PLAIN_TEXT:
			highlightedCode = highlightPlainText(args.code)
			break

		default:
			highlightedCode = await highlightStarryNight(args.code, args.language)
			break
	}

	// Highlight lines
	if (args.lineHighlights) {
		highlightedCode = highlightLines(highlightedCode, args.lineHighlights)
	}

	// Define attributes
	const attributes = []
	if (args.language) {
		attributes.push(`data-language="${args.language}"`)
	}
	if (args.filename) {
		attributes.push(`data-filename="${args.filename}"`)
	}
	if (args.lineHighlights) {
		attributes.push(
			`data-line-highlights="${args.lineHighlights
				.map(([start, end]) => (start === end ? start : `${start}-${end}`))
				.join(",")}"`,
		)
	}

	// Return parsed code
	return `<figure class="highlight"${
		attributes.length ? ` ${attributes.join(" ")}` : ""
	}>${
		args.filename ? `<figcaption>${args.filename}</figcaption>` : ""
	}<div class="highlightWrapper"><pre><code>${highlightedCode}</code></pre></div></figure>`
}
