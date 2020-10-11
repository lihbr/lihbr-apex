const Prismic = require("prismic-javascript");
const cloneDeep = require("lodash/cloneDeep");

const logger = require("../logger");
const { get, bulkGet } = require("../helpers");
const formatOptionsPresets = require("../formatOptionsPresets");

/**
 * Get overview of a blog post
 * @param {Object} blogPost - full blog post
 * @return {Object} - blog post overview
 */
const toBlogPostOverview = blogPost => {
  return {
    id: blogPost._ctx.id,
    href: blogPost._ctx.href,
    title: blogPost.title,
    thumbnail: blogPost.thumbnail,
    categories: blogPost.categories,
    color: blogPost.color,
    excerpt: blogPost.lead_text,
    published_date: blogPost.published_date
  };
};

/**
 * Format slices of given documents
 * @param {Object} document - document to format
 * @param {Array} sliceKeys - document keys containing slices to format
 * @param {Object} payload - data to use on format
 */
const lateSlicesFormat = (document, sliceKeys, payload) => {
  sliceKeys.forEach(key => {
    if (document[key]) {
      document[key].forEach(slice => {
        if (payload[slice.slice_type]) {
          switch (slice.slice_type) {
            case "recent-blog-posts":
              const limit = slice.primary.amount_to_display || 3;
              slice.primary.featured = payload[slice.slice_type]
                .slice(0, limit)
                .filter(({ id }) => id !== document._ctx.id);

              if (
                slice.primary.featured.length !== limit &&
                payload[slice.slice_type].length > limit
              ) {
                slice.primary.featured.push(payload[slice.slice_type][limit]);
              }
              break;

            case "art":
              if (slice.primary.featured_art && slice.primary.featured_art.id) {
                slice.primary.featured_art = payload[slice.slice_type].find(
                  art => art._ctx.id === slice.primary.featured_art.id
                );
              }
              break;

            default:
              break;
          }
        }
      });
    } else {
      logger.warn(`"${key}" is not defined for document: ${document._ctx.id}`);
    }
  });
};

/**
 * Fetch routes data from Prismic
 * @param {Object} global - global data fetched from Prismic
 * @param {Boolean} returnFirstMatch - return first route matching matchRegex
 * @param {RegExp} matchRegex - regex to text route against
 * @param {String} ref - ref to use with API
 * @return {Array/Object} - found routes
 */
const fetch = async (
  global = {},
  { returnFirstMatch = false, matchRegex = /.*/, ref } = {}
) => {
  const routes = [];
  const slicesPayload = {
    art: global.arts
  };

  /**
   * Blog posts
   */
  const blogPosts = (
    await bulkGet({
      query: Prismic.Predicates.at("document.type", "post__blog"),
      options: {
        orderings: "[document.first_publication_date desc]",
        ref
      },
      formatOptions: formatOptionsPresets.post__blog
    })
  )
    .map(({ data: blogPost }) => {
      // Resolve categories
      blogPost.categories = blogPost.categories.map(item => {
        item = global.categories.find(
          category => category._ctx.id === item.category.id
        );

        return item;
      });

      // Resolve color
      if (blogPost.color && blogPost.color.id) {
        blogPost.color = global.colors.find(
          color => color._ctx.id === blogPost.color.id
        ).name;
      } else {
        delete blogPost.color;
      }

      return blogPost;
    })
    .sort((a, b) => (a.published_date < b.published_date ? 1 : -1));

  // Creating blog post overviews array
  slicesPayload["recent-blog-posts"] = blogPosts.map(toBlogPostOverview);

  // Late formatting slices
  blogPosts.forEach(blogPost => {
    blogPost.slices = cloneDeep(global.settings.blog_slices);

    lateSlicesFormat(
      blogPost,
      formatOptionsPresets.post__blog.slices,
      slicesPayload
    );
  });

  if (returnFirstMatch) {
    // Return match if there's one in blog posts
    const match = blogPosts.find(i => i._ctx.href.match(matchRegex));
    if (match) {
      return match;
    }
  }

  routes.push(...blogPosts);

  /**
   * Pages settings
   */
  const rawPagesSettings = (
    await get({
      query: Prismic.Predicates.at("document.type", "settings__pages"),
      options: { ref },
      formatOptions: formatOptionsPresets.settings__pages
    })
  ).data;
  const pagesSettings = {};

  // Sorting raw pages settings
  for (const _key in rawPagesSettings) {
    if (_key !== "_ctx") {
      const match = _key.match(/(?<page>[a-zA-Z-]+)_(?<key>.+)/);
      if (match) {
        pagesSettings[match.groups.page] =
          pagesSettings[match.groups.page] || {};
        pagesSettings[match.groups.page][match.groups.key] =
          rawPagesSettings[_key];
      } else {
        logger.warn(rawPagesSettings);
        logger.warn(
          `"${_key}" is not a page namespaced key inside rawPagesSettings: ${JSON.stringify(
            rawPagesSettings
          ).slice(0, 100)}...`
        );
      }
    } else {
      pagesSettings._ctx = rawPagesSettings._ctx;
    }
  }

  /**
   * Pages
   */
  const pages = (
    await bulkGet({
      query: Prismic.Predicates.at("document.type", "page"),
      options: { ref },
      formatOptions: formatOptionsPresets.page
    })
  ).map(({ data: page }) => {
    switch (page._ctx.href) {
      case "/":
        for (const key in pagesSettings.home) {
          page[key] = pagesSettings.home[key];
        }

        const homeBlogPostsLimit = Math.min(
          page.blog_post_feed_limit > 1 ? page.blog_post_feed_limit : 6,
          slicesPayload["recent-blog-posts"].length
        );

        const homeBlogPosts = slicesPayload["recent-blog-posts"].slice(
          0,
          // Round number of blogpost to an even number
          homeBlogPostsLimit - (homeBlogPostsLimit % 2)
        );

        page.blogPosts = homeBlogPosts;
        break;

      case "/blog":
        for (const key in pagesSettings.blog) {
          page[key] = pagesSettings.blog[key];
        }

        // Sort blog posts for hub
        const blogSortedBlogPosts = slicesPayload["recent-blog-posts"].reduce(
          (sorted, post) => {
            const key = post.published_date
              ? post.published_date.slice(0, 4)
              : "unknown";

            if (!sorted[key]) {
              sorted[key] = [];
            }

            sorted[key].push(post);

            return sorted;
          },
          {}
        );

        page.sortedBlogPosts = blogSortedBlogPosts;

        // Define display order
        const blogSortedOrder = Object.keys(blogSortedBlogPosts)
          .filter(key => blogSortedBlogPosts[key].length > 0)
          .sort()
          .reverse();

        page.sortedOrder = blogSortedOrder;
        break;

      case "/art":
        for (const key in pagesSettings.art) {
          page[key] = pagesSettings.art[key];
        }

        page.form = page.form.reduce((form, item) => {
          form[item.key] = item;
          return form;
        }, {});
        break;

      case "/about":
        for (const key in pagesSettings.about) {
          page[key] = pagesSettings.about[key];
        }
        break;

      case "/contact":
        for (const key in pagesSettings.contact) {
          page[key] = pagesSettings.contact[key];
        }
        page.form = page.form.reduce((form, item) => {
          form[item.key] = item;
          return form;
        }, {});
        break;

      default:
        break;
    }

    lateSlicesFormat(page, formatOptionsPresets.page.slices, slicesPayload);

    return page;
  });

  if (returnFirstMatch) {
    // Return match if there's one in pages
    const match = pages.find(i => i._ctx.href.match(matchRegex));
    if (match) {
      return match;
    }
  }

  routes.push(...pages);

  // If no route matched
  if (returnFirstMatch) {
    throw new Error("not found");
  }

  /**
   * Return routes array
   */
  return routes.map(route => ({
    route: route._ctx.href,
    payload: route
  }));
};

module.exports = { fetch };
