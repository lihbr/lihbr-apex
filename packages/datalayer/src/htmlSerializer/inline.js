module.exports = children => {
  let parsedChildren = children.join("");

  // Parse inline code
  /* eslint-disable-next-line prettier/prettier */
  parsedChildren = parsedChildren.replace(/`(.*?)`/g, "<code class=\"inline\">$1</code>");

  return parsedChildren;
};
