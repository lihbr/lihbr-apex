require("dotenv").config();

exports.handler = function (event, context, callback) {
  callback(null, {
    statusCode: 200,
    body: JSON.stringify({
      netlify: process.env.NETLIFY || "undefined",
      branch: process.env.BRANCH || "undefined",
      commitRef: process.env.COMMIT_REF || "undefined"
    })
  });
};
