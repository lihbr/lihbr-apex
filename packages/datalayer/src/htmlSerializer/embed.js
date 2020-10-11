module.exports = ({ element }) => {
  let sanitizedHtml = element.oembed.html;
  // Making sure any embed link link to a new page
  const anchors = element.oembed.html.match(/<a\b[^>]*>/g);
  if (anchors && anchors.length) {
    for (const oldAnchor of anchors) {
      if (!oldAnchor.match(/target=["'"]/)) {
        const newAnchor = oldAnchor.replace(
          /<a\b/,
          /* eslint-disable-next-line prettier/prettier */
          "<a target=\"_blank\" rel=\"noopener\""
        );

        sanitizedHtml = sanitizedHtml.replace(oldAnchor, newAnchor);
      }
    }
  }

  switch (element.oembed.provider_name) {
    case "YouTube":
      // Remove obsolete attribute
      sanitizedHtml = sanitizedHtml.replace(/\sframeborder=("|')\d*\1/, "");
      break;

    default:
      break;
  }

  return `
    <div
      data-oembed="${element.oembed.embed_url}"
      data-oembed-type="${element.oembed.type}"
      data-oembed-provider="${element.oembed.provider_name}"
      ${element.label ? ` class="${element.label}"` : ""}
    >
      ${sanitizedHtml}
    </div>
  `;
};
