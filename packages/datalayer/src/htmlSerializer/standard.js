const inline = require("./inline");

module.exports = ({ children }, options, tag) => {
  const content = inline(children);

  return `<${tag}>${content}</${tag}>`;
};
