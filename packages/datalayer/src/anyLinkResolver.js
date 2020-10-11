const logger = require("./logger");
const linkResolver = require("./linkResolver");

/**
 * Any link resolver
 */
module.exports = link => {
  switch (link.link_type) {
    case "Document":
      return {
        href: linkResolver(link),
        blank: false
      };

    case "Web":
      return {
        href: link.url,
        blank: !!link.target
      };

    case "Media":
      return {
        href: link.url,
        blank: true
      };

    case "Any":
      return {
        href: undefined,
        blank: undefined
      };

    default:
      logger.error(link);
      logger.error(
        `Type "${link.link_type}" is not handled by anyLinkResolver()`
      );
      process.exit(1);
  }
};
