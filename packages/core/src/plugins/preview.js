import fetch from "isomorphic-unfetch";
import { parse } from "cookie";
import Vue from "vue";

export default context => {
  // TODO: Refactor into 2 functions
  const handleError = err => {
    console.error(err);

    if (context.$sentry) {
      context.$sentry.captureException(err);
    }

    if (err.statusCode) {
      context.error({ statusCode: err.statusCode, message: "" });
    } else if (err.status) {
      context.error({ statusCode: err.status, message: "" });
    } else {
      context.error({ statusCode: 0, message: "" });
    }
  };

  /**
   * Resolve preview query
   */
  const resolve = async () => {
    const { href } = context.query;

    if (!href) {
      context.error({ statusCode: 404 });
    } else {
      context.redirect(`${href}?preview=script`);
    }
  };

  /**
   * Get page content from API
   * @param {String} href - page path
   * @return {Object} - page content
   */
  const get = async href => {
    try {
      const response = await fetch("/api/v1/preview-get", {
        method: "POST",
        body: JSON.stringify({ href })
      });
      if (!response.ok) {
        throw response; // non-200 code
      }
      const { data } = await response.json();
      return { data };
    } catch (err) {
      handleError(err);
    }
  };

  /**
   * Check if request has a preview token
   * @return {Boolean} - true if a preview token is found
   */
  const hasToken = () => {
    if (typeof document === "undefined") {
      return false;
    }

    const prismicCookie = parse(document.cookie)["io.prismic.preview"];

    if (!prismicCookie) {
      return false;
    }

    try {
      return (
        !!JSON.parse(prismicCookie)?.[`${process.env.PRISMIC_REPO}.prismic.io`]
          ?.preview ?? false
      );
    } catch (err) {
      console.error(err);

      if (context.$sentry) {
        context.$sentry.captureException(err);
      }

      return false;
    }
  };

  /**
   * Check if request has a preview query
   * @return {Boolean} - true if a preview query is found
   */
  const hasQuery = () => context.query.preview === "script";

  /**
   * Check if current context requires script
   * @return {Boolean} - true if context requires script
   */
  const needScript = () => hasToken() || hasQuery();

  /**
   * Returns preview script
   * @return {Object} - Vue meta script object
   */
  const getScript = () => {
    return {
      src: `https://static.cdn.prismic.io/prismic.min.js?repo=${process.env.PRISMIC_REPO}&new=true`,
      async: true,
      defer: true
    };
  };

  const preview = {
    resolve,
    get,
    hasToken,
    hasQuery,
    needScript,
    getScript
  };

  Vue.prototype.$prismicPreview = preview;
  context.$prismicPreview = preview;

  // Enable preview if needed
  if (hasToken()) {
    context.enablePreview();
  }
};
