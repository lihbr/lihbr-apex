require("dotenv").config();

exports.handler = function (event, context, callback) {
  callback(null, {
    statusCode: 200,
    body: JSON.stringify({
      context: context || "undefined",
      netlify: process.env.NETLIFY || "undefined",
      branch: process.env.BRANCH || "undefined",
      commitRef: process.env.COMMIT_REF || "undefined",
      _netlify: process.env._NETLIFY || "undefined",
      _branch: process.env._BRANCH || "undefined",
      _commitRef: process.env._COMMIT_REF || "undefined"
    })
  });
};
