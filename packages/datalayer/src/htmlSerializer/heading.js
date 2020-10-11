const slugify = require("slugify");
slugify.extend({ _: "-" });

const inline = require("./inline");

// Add anchored link to each heading
module.exports = (
  { element, children },
  { FRAMEWORK_LINK = "a" } = {},
  tag = "h1"
) => {
  const slug = slugify(element.text, {
    replacement: "-",
    remove: /[*+~()`'"!?:;,.@°]/g,
    lower: true
  });

  const anchorOpenTag = `<a href="#${slug}" class="pageAnchor">`;
  const anchorCloseTag = "</a>";

  // Marking sure to not nest anchor tags inside heading
  const parsedContent = inline(children).replace(
    new RegExp(
      // Match previous anchors and wrap them correctly
      `(<(a|${FRAMEWORK_LINK})\\b[^>]*>(.*?)<\\/(a|${FRAMEWORK_LINK})>)`,
      "g"
    ),
    `${anchorCloseTag}$1${anchorOpenTag}`
  );

  // Resolve class name
  const className = element.label ? ` class="${element.label}"` : "";

  return `<${tag} id="${slug}"${className} data-scroll-margin-top="128">${anchorOpenTag}${parsedContent}${anchorCloseTag}</${tag}>`;
};
