const content = require("./content");

const htmlSerializer = require("./htmlSerializer");
const linkResolver = require("./linkResolver");

const utils = require("./utils");
const formatOptionsPresets = require("./formatOptionsPresets.json");
const { previewCookie } = require("@prismicio/client");

module.exports = {
  content,

  htmlSerializer,
  linkResolver,

  utils,
  formatOptionsPresets,
  previewCookie
};
