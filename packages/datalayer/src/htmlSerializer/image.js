const PrismicDOM = require("prismic-dom");
const linkResolver = require("../linkResolver");

module.exports = (
  { element },
  { FRAMEWORK_LINK = "a", FRAMEWORK_LINK_ENABLED } = {}
) => {
  let result = `<img src="${element.url}" alt="${
    element.alt || ""
  }" loading="lazy">`;

  if (element.linkTo) {
    const url = PrismicDOM.Link.url(element.linkTo, linkResolver);

    if (element.linkTo.link_type === "Document") {
      if (FRAMEWORK_LINK_ENABLED) {
        result = `<${FRAMEWORK_LINK} to="${url}" title="${element.alt}">${result}</${FRAMEWORK_LINK}>`;
      } else {
        result = `<a href="${url}" title="${element.alt}" data-nuxt-link>${result}</a>`;
      }
    } else {
      // Force blank targer for link on image
      const target = element.linkTo.target
        ? ` target="${element.linkTo.target}" rel="noopener"`
        : "";
      result = `<a href="${url}" title="${element.alt}"${target}>${result}</a>`;
    }
  }

  result = `<figure${element.label ? ` class="${element.label}"` : ""}${
    element.copyright ? ` data-copyright="© ${element.copyright}"` : ""
  }>${result}</figure>`;
  return result;
};
