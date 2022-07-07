import Prism from "prismjs";
import loadLanguages from "prismjs/components/";

const DEFAULT_LANGUAGES = [
	"markup",
	"html",
	"xml",
	"svg",
	"mathml",
	"ssml",
	"atom",
	"rss",
	"css",
	"clike",
	"javascript",
	"js",
];
const NON_DEFAULT_LANGUAGES = ["bash", "json", "sass", "scss", "typescript"];
const SUPPORTED_LANGUAGES = [...DEFAULT_LANGUAGES, ...NON_DEFAULT_LANGUAGES];

loadLanguages(SUPPORTED_LANGUAGES);

// https://regex101.com/r/IybNni/1
const OPTIONS_REGEX =
	/^\s*\/(?<language>[\w-]+)?(?:\[(?<filename>[\/\w\s.~_-]*)\])?(?:{(?<highlights>[\s\d,-]*)})?\/\s*/;

const HTML_PREVIEW = "html-preview";

/**
 * Parse highlight strings
 */
const parseHighlights = (raw = ""): number[][] => {
	let lastEnd = 0;

	return (
		raw
			// Remove all whitespaces
			.replace(/\s/g, "")
			// Split to array
			.split(",")
			// Parse ranges
			.map((range) => {
				const [start, end] = range.split("-").map((n) => parseInt(n));

				return [start, end || start];
			})
			// Filter invalid inputs
			.filter(([start, end]) => !isNaN(start) && !isNaN(end) && start > 0)
			// Sort ranges
			.sort((a, b) => a[0] - b[0])
			// Normalize ranges
			.map(([start, end]) => {
				start = Math.max(start, lastEnd + 1);
				lastEnd = end;

				return [start, end];
			})
			// Filter invalid ranges
			.filter(([start, end]) => start <= end)
	);
};

/**
 * Parse raw with a given language
 */
const parseCode = (raw: string, language: string | null): string => {
	// Strip options from input
	raw = raw.replace(OPTIONS_REGEX, "").replace(/^\s/g, "");

	if (language) {
		try {
			return Prism.highlight(raw, Prism.languages[language], language);
		} catch (err) {
			console.warn(err);
			console.warn(
				`Language "${language}" is not loaded into Prism! Formatting as plain text.`,
			);
		}
	}

	// Defaults to plain text
	return raw
		.split(/\r?\n/)
		.map((line) => `<span class="token">${line}</span>`)
		.join("\n");
};

/**
 * Highlight code with given highlights
 */
const highlightCode = (code: string, highlights: number[][] = []): string => {
	if (!highlights.length) {
		return code;
	}

	// Split line by line
	const highlightedCode: string[] = code.split(/\r?\n/);

	for (const [start, end] of highlights) {
		if (start > highlightedCode.length) {
			break;
		}

		// Add opening tag
		highlightedCode[
			start - 1
		] = `<span class="highlight"><span class="highlightWrapper">${
			highlightedCode[start - 1]
		}`;

		// Add closing tag
		const minEnd = Math.min(highlightedCode.length, end);
		highlightedCode[minEnd - 1] = `${
			highlightedCode[minEnd - 1]
		}</span></span>`;
	}

	return highlightedCode.join("\n");
};

/**
 * Prismic HTML serializer
 */
export const prismFormat = (
	raw: string,
	language: string | null = null,
): string => {
	let parsedCode: string | null = null;
	let resolvedLanguage = language;
	let filename: string | null = null;
	let highlights: number[][] = [];

	const match = raw.match(OPTIONS_REGEX);

	// Set according to match
	if (match && match.groups) {
		resolvedLanguage = match.groups.language;
		filename = match.groups.filename;
		highlights = parseHighlights(match.groups.highlights);
	}

	if (resolvedLanguage === HTML_PREVIEW) {
		return `<figure>${raw
			.replace(OPTIONS_REGEX, "")
			.replace(/^\s/g, "")}</figure>`;
	} else {
		// Parse code
		parsedCode = highlightCode(parseCode(raw, resolvedLanguage), highlights);

		// Define attributes
		const attributes = [];
		if (resolvedLanguage) {
			attributes.push(`data-language="${resolvedLanguage}"`);
		}
		if (filename) {
			attributes.push(`data-filename="${filename}"`);
		}

		// Return parsed code
		return `<div class="prism"${
			attributes.length ? ` ${attributes.join(" ")}` : ""
		}><div class="prismWrapper"><pre><code>${parsedCode}</code></pre></div></div>`;
	}
};
