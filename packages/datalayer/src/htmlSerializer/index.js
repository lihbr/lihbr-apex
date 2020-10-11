const PrismicDOM = require("prismic-dom");
const Elements = PrismicDOM.RichText.Elements;

// Serializer
const heading = require("./heading");
const paragraph = require("./paragraph");
const preformatted = require("./preformatted");
const image = require("./image");
const hyperlink = require("./hyperlink");
const embed = require("./embed");
const standard = require("./standard");

// Serializer options
const options = {
  FRAMEWORK_LINK: "nuxt-link",
  FRAMEWORK_LINK_ENABLED: false
};

/**
 * Prismic html serializer
 */
module.exports = (type, element, content, children) => {
  const context = {
    type,
    element,
    content,
    children
  };

  switch (type) {
    case Elements.heading1:
      return heading(context, options, "h1");
    case Elements.heading2:
      return heading(context, options, "h2");
    case Elements.heading3:
      return heading(context, options, "h3");
    case Elements.heading4:
      return heading(context, options, "h4");
    case Elements.heading5:
      return heading(context, options, "h5");
    case Elements.heading6:
      return heading(context, options, "h6");

    case Elements.paragraph:
      return paragraph(context, options);

    case Elements.preformatted:
      return preformatted(context, options);

    case Elements.image:
      return image(context, options);

    case Elements.hyperlink:
      return hyperlink(context, options);

    case Elements.embed:
      return embed(context, options);

    case Elements.listItem:
      return standard(context, options, "li");

    case Elements.oListItem:
      return standard(context, options, "li");

    default:
      return null;
  }
};
