const Prismic = require("prismic-javascript");
const PrismicDOM = require("prismic-dom");
const cloneDeep = require("lodash/cloneDeep");

const logger = require("./logger");
const linkResolver = require("./linkResolver");
const anyLinkResolver = require("./anyLinkResolver");
const htmlSerializer = require("./htmlSerializer");
const formatOptionsPresets = require("./formatOptionsPresets");

/**
 * Apply callback on given list of keys
 * @param {Object} keys - data keys to alter
 * @param {Object} data - data to work on
 * @param {Function} callback - callback to apply
 */
const applyOption = (keys, data, callback) => {
  if (!keys) {
    return;
  }

  keys.forEach(_key => {
    const [key, subKey] = _key.split(".");

    if (typeof data[key] !== "undefined") {
      if (typeof subKey === "undefined") {
        callback(data, key);
      } else if (Array.isArray(data[key])) {
        data[key].forEach(item => {
          if (typeof item[subKey] !== "undefined") {
            callback(item, subKey);
          } else {
            // Array item not found
            logger.warn(item);
            logger.warn(
              `"${subKey}" is not defined for document's array item: ${JSON.stringify(
                item
              ).slice(0, 100)}...`
            );
          }
        });
      } else {
        // Array is not an array
        logger.warn(data);
        logger.warn(
          `"${key}" is not an array though it's configured as one: ${_key}`
        );
      }
    } else if (key !== "slices") {
      // Key not found
      logger.warn(data);
      logger.warn(
        `"${key}" is not defined for document: ${JSON.stringify(data).slice(
          0,
          100
        )}...`
      );
      data[key] = "";
    }
  });
};

/**
 * Formatters used as callback for applyOption
 */
const formatter = {
  title: (data, key) => {
    if (data[key][0]) {
      data[key] = data[key][0].text.replace(/ /g, " ");
    } else {
      data[key] = "";
    }
  },
  html: (data, key) => {
    data[`${key}_html`] = PrismicDOM.RichText.asHtml(
      data[key],
      linkResolver,
      htmlSerializer
    ).replace(/ /g, " ");
  },
  text: (data, key) => {
    data[`${key}_text`] = PrismicDOM.RichText.asText(data[key]).replace(
      / /g,
      " "
    );
  },
  link: (data, key) => {
    data[key] = anyLinkResolver(data[key]);
  },
  __clean: (data, key) => {
    delete data[key];
  }
};
formatter.all = (options, data) => {
  applyOption(options.titles, data, formatter.title);
  applyOption(options.htmls, data, formatter.html);
  applyOption(options.texts, data, formatter.text);
  applyOption(options.booleans, data, formatter.boolean);
  applyOption(options.links, data, formatter.link);
  // Delete raw text keys
  applyOption([...options.htmls, ...options.texts], data, formatter.__clean);
};

/**
 * Format Prismic document data
 * @param {Object} document - Prismic document
 * @param {Object} options - parser options
 */
const format = async (document, options) => {
  const { data } = document;

  data._ctx = {
    id: document.id,
    uid: document.uid,
    type: document.type,
    first_publication_date: document.first_publication_date,
    last_publication_date: document.last_publication_date,
    lang: document.lang
  };

  if (options.href) {
    data._ctx.href = linkResolver(document);
  }

  formatter.all(options, data);

  applyOption(options.slices, data, (data, key) => {
    data[key].forEach(slice => {
      const sliceOptions = formatOptionsPresets.__slices[slice.slice_type];

      if (sliceOptions) {
        formatter.all(sliceOptions.primary, slice.primary);
        slice.items.forEach(sliceItem => {
          formatter.all(sliceOptions.items, sliceItem);
        });
      }

      // Normalize slice_type name
      const prefix = ["page_content"].includes(slice.slice_type) ? "__" : "";
      slice.slice_type = `${prefix}${slice.slice_type.replace(/_/g, "-")}`;
    });
  });
};

let _api;
/**
 * Get Prismic API to api variables
 * @param {Boolean} singleUse - do not save api in memory cache
 * @return {Object} - the api
 */
const getApi = async (singleUse = false) => {
  if (!singleUse && typeof _api !== "undefined") {
    return _api;
  } else {
    const api = await Prismic.getApi(process.env.PRISMIC_ENDPOINT, {
      accessToken: process.env.PRISMIC_TOKEN
    });

    if (!singleUse) {
      _api = api;
    }

    return api;
  }
};

/**
 * Get a single Prismic document
 * @param {Object} query - Prismic API query
 * @param {Object} options - Prismic API query options
 * @param {Object} formatOptions - formatter options
 * @param {Boolean} singleUse - do not save api in memory cache
 */
const get = async ({ query, options, formatOptions } = {}, singleUse) => {
  const api = await getApi(singleUse);

  const raw = cloneDeep(await api.query(query, options));
  if (!raw.results[0]) {
    throw new Error("no document not found");
  } else {
    if (formatOptions) {
      format(raw.results[0], formatOptions);
    }

    return raw.results[0];
  }
};

/**
 * Get all Prismic document
 * @param {Object} query - Prismic API query
 * @param {Object} options - Prismic API query options
 * @param {Object} formatOptions - formatter options
 * @param {Boolean} singleUse - do not save api in memory cache
 */
const bulkGet = async ({ query, options, formatOptions } = {}, singleUse) => {
  const api = await getApi(singleUse);

  const raw = cloneDeep(await api.query(query, options));

  const { results } = raw;

  if (raw.page < raw.total_pages) {
    results.push(
      ...(await bulkGet({ query, options: { ...options, page: raw.page + 1 } }))
    );
  }

  if (formatOptions) {
    results.forEach(result => format(result, formatOptions));
  }

  return results;
};

/**
 * Resolve a document preview location
 * @param {String} token - preview token
 * @param {String} documentId - document to find location
 * @param {Boolean} singleUse - do not save api in memory cache
 * @return {String} - resolved document location
 */
const resolvePreview = async ({ token, documentId } = {}, singleUse) => {
  if (!token || !documentId) {
    /* eslint-disable-next-line prettier/prettier */
    throw new Error("\"token\" and \"documentId\" parameters are required");
  }

  const api = await getApi(singleUse);

  const href = await api
    .getPreviewResolver(token, documentId)
    .resolve(linkResolver, "/");

  return href;
};

module.exports = {
  format,
  get,
  bulkGet,
  resolvePreview
};
