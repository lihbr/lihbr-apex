const Color = require("color");
const Prismic = require("prismic-javascript");

const anyLinkResolver = require("../anyLinkResolver");
const { get, bulkGet } = require("../helpers");
const formatOptionsPresets = require("../formatOptionsPresets");

/**
 * Fetch global data from Prismic
 * @param {String} ref - ref to use with API
 * @return {Object} - global content
 */
const fetch = async ({ ref } = {}) => {
  /**
   * Settings
   */
  const settings = (
    await get({
      query: Prismic.Predicates.at("document.type", "settings"),
      options: { ref },
      formatOptions: formatOptionsPresets.settings
    })
  ).data;
  delete settings._ctx;

  /**
   * Colors
   */
  const colors = (
    await bulkGet({
      query: Prismic.Predicates.at("document.type", "taxonomy__color"),
      options: { ref },
      formatOptions: formatOptionsPresets.taxonomy__color
    })
  ).map(({ data }) => data);

  /**
   * Categories
   */
  const categories = (
    await bulkGet({
      query: Prismic.Predicates.at("document.type", "taxonomy__category"),
      options: { ref },
      formatOptions: formatOptionsPresets.taxonomy__category
    })
  ).map(({ data: category }) => {
    // Resolve color
    if (category.color && category.color.id) {
      category.color = colors.find(
        color => color._ctx.id === category.color.id
      ).name;
    } else {
      delete category.color;
    }
    return category;
  });

  /**
   * Arts
   */
  const arts = (
    await bulkGet({
      query: Prismic.Predicates.at("document.type", "post__art"),
      options: { ref },
      formatOptions: formatOptionsPresets.post__art
    })
  )
    .map(({ data: art }) => {
      art.background_color = Color(art.background_color)
        .alpha(0.5)
        .rgb()
        .toString();
      return art;
    })
    .sort((a, b) => (a.published_date < b.published_date ? 1 : -1));

  return { settings, colors, categories, arts };
};

module.exports = { fetch };
