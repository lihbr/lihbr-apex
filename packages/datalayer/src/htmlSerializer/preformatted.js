const Prism = require("prismjs");

const logger = require("../logger");

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
  "js"
];
const NON_DEFAULT_LANGUAGES = ["bash", "json", "sass", "scss", "typescript"];
const SUPPORTED_LANGUAGES = [...DEFAULT_LANGUAGES, ...NON_DEFAULT_LANGUAGES];

require("prismjs/components/")(NON_DEFAULT_LANGUAGES);

// https://regex101.com/r/hEx9yW/3
const OPTIONS_REGEX = /^\s*\/(?<language>[\w-]+)?(?:\[(?<filename>[\/\w\s.-~]*)\])?(?:{(?<highlights>[\d\s,-]*)})?\/\s*/;

const HTML_PREVIEW = "html-preview";

/**
 * Parse highlight strings
 * @param {String} raw - raw input
 * @return {Array} - parsed input
 */
parseHighlights = (raw = "") => {
  let lastEnd = 0;
  return (
    raw
      // Remove all whitespaces
      .replace(/\s/g, "")
      // Split to array
      .split(",")
      // Parse ranges
      .map(range => {
        const [start, end] = range.split("-").map(n => parseInt(n));
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
 * @param {String} raw - raw input
 * @param {String} language - language to parse as
 * @return {String} - parsed input
 */
const parseCode = (raw, language) => {
  // Strip options from input
  raw = raw.replace(OPTIONS_REGEX, "").replace(/^\s/g, "");

  if (language) {
    try {
      return Prism.highlight(raw, Prism.languages[language], language);
    } catch (err) {
      logger.warn(err);
      logger.warn(
        `Language "${language}" is not loaded into Prism! Formatting as plain text.`
      );
    }
  }

  // Defaults to plain text
  return raw
    .split(/\r?\n/)
    .map(line => `<span class="token">${line}</span>`)
    .join("\n");
};

/**
 * Highlight code with given highlights
 * @param {String} code - parsed code
 * @param {Array} highlights - array of highlight
 */
const highlightCode = (code, highlights = []) => {
  if (!highlights.length) {
    return code;
  }

  // Split line by line
  code = code.split(/\r?\n/);

  for (const [start, end] of highlights) {
    if (start > code.length) {
      break;
    }

    // Add opening tag
    code[start - 1] = `<span class="highlight"><span class="highlightWrapper">${
      code[start - 1]
    }`;

    // Add closing tag
    const minEnd = Math.min(code.length, end);
    code[minEnd - 1] = `${code[minEnd - 1]}</span></span>`;
  }

  return code.join("\n");
};

module.exports = ({ element }) => {
  const rawCode = element.text;
  let parsedCode, language, filename, highlights;

  const match = rawCode.match(OPTIONS_REGEX);

  // Set according to match
  if (match && match.groups) {
    language = match.groups.language;
    filename = match.groups.filename;
    highlights = parseHighlights(match.groups.highlights);
  }

  if (language === HTML_PREVIEW) {
    return `<figure>${rawCode
      .replace(OPTIONS_REGEX, "")
      .replace(/^\s/g, "")}</figure>`;
  } else {
    // Parse code
    parsedCode = highlightCode(parseCode(rawCode, language), highlights);

    // Define attributes
    const attributes = [];
    if (language) {
      attributes.push(`data-language="${language}"`);
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
