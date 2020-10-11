/**
 * Import
 */
const { request, response } = require("@lihbr/utils-netlify.lambda");

/**
 * Controller
 */
const ctrl = {
  GET: async () => {
    return response.formatted.success({ status: 200 });
  }
};

/**
 * Export
 */
exports.handler = (event, context, callback) =>
  request.route(event, context, callback, ctrl);
