const PrismicDOM = require("prismic-dom");

const linkResolver = require("../linkResolver");
const inline = require("./inline");

module.exports = (
  { element, children },
  { FRAMEWORK_LINK = "a", FRAMEWORK_LINK_ENABLED } = {}
) => {
  let result = "";
  const url = PrismicDOM.Link.url(element.data, linkResolver);
  const parsedContent = inline(children);

  if (element.data.link_type === "Document") {
    if (FRAMEWORK_LINK_ENABLED) {
      result = `<${FRAMEWORK_LINK} to="${url}">${parsedContent}</${FRAMEWORK_LINK}>`;
    } else {
      result = `<a href="${url}" data-nuxt-link>${parsedContent}</a>`;
    }
  } else {
    const target = element.data.target
      ? ` target="${element.data.target}" rel="noopener"`
      : "";
    result = `<a href="${url}"${target}>${parsedContent}</a>`;
  }
  return result;
};
