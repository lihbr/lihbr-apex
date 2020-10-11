const content = require("./content");

const htmlSerializer = require("./htmlSerializer");
const linkResolver = require("./linkResolver");

const helpers = require("./helpers");
const formatOptionsPresets = require("./formatOptionsPresets.json");
const { previewCookie } = require("prismic-javascript");

module.exports = {
  content,

  htmlSerializer,
  linkResolver,

  helpers,
  formatOptionsPresets,
  previewCookie
};
