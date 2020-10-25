require("dotenv").config();
const fs = require("fs");

exports.handler = function (event, context, callback) {
  const env = fs.readFileSync(".env");
  callback(null, {
    statusCode: 200,
    body: JSON.stringify({
      env: env || "undefined",
      netlify: process.env.NETLIFY || "undefined",
      branch: process.env.BRANCH || "undefined",
      commitRef: process.env.COMMIT_REF || "undefined"
    })
  });
};
