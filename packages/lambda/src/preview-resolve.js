/**
 * Import
 */
require("dotenv").config();
const cookie = require("cookie");

const { request, response } = require("@lihbr/utils-netlify.lambda");
const datalayer = require("@lihbr/lihbr-apex.datalayer");

/**
 * Controller
 */
const ctrl = {
  GET: async event => {
    const { token, documentId } = event.queryStringParameters;

    if (!token || !documentId) {
      return response.formatted.error({ status: 400 });
    }

    const href = await datalayer.utils.resolvePreview(
      { token, documentId },
      true
    );

    const cookieContent = {};
    cookieContent[`${process.env.PRISMIC_REPO}.prismic.io`] = {
      preview: token
    };

    return response.special.redirect({
      status: 302,
      href: `/preview?href=${href}`,
      headers: {
        "set-cookie": cookie.serialize(
          datalayer.previewCookie,
          JSON.stringify(cookieContent),
          {
            path: "/",
            secure: !!process.env.NETLIFY
          }
        )
      }
    });
  }
};

/**
 * Export
 */
exports.handler = (event, context, callback) =>
  request.route(event, context, callback, ctrl);
