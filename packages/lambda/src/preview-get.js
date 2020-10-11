/**
 * Import
 */
require("dotenv").config();
const cookie = require("cookie");

const { request, response } = require("@lihbr/utils-netlify.lambda");
const datalayer = require("@lihbr/lihbr-apex.datalayer");

const Sentry = require("./utils/Sentry");

/**
 * Controller
 */
const ctrl = {
  POST: async event => {
    // Get token
    let token;
    try {
      token = JSON.parse(
        cookie.parse(event.headers.cookie)[datalayer.previewCookie]
      )[`${process.env.PRISMIC_REPO}.prismic.io`].preview;
    } catch (err) {
      console.error(err);
      Sentry.captureException(err);
      await Sentry.flush();
      return response.formatted.error({
        status: 400,
        msg: "no token provided"
      });
    }

    // Parse body
    let body;
    try {
      body = JSON.parse(event.body);
    } catch (err) {
      console.error(err);
      Sentry.captureException(err);
      await Sentry.flush();
      return response.formatted.error({
        status: 400,
        msg: "provided body is not valid json"
      });
    }

    // Validate body
    for (const key of ["href"]) {
      if (!body[key]) {
        return response.formatted.error({
          status: 400,
          msg: `body is missing field: "${key}"`
        });
      }
    }

    const dlGlobal = await datalayer.content.global.fetch({ ref: token });

    const data = await datalayer.content.routes.fetch(dlGlobal, {
      returnFirstMatch: true,
      matchRegex: new RegExp(`^${body.href}$`, "i"),
      ref: token
    });

    return response.formatted.success({
      status: 200,
      data
    });
  }
};

/**
 * Export
 */
exports.handler = (event, context, callback) =>
  request.route(event, context, callback, ctrl);
