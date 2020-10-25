require("dotenv").config();

exports.handler = function (event, context, callback) {
  callback(null, {
    statusCode: 200,
    body: JSON.stringify({
      netlify: process.env.NETLIFY,
      branch: process.env.BRANCH,
      commitRef: process.env.COMMIT_REF
    })
  });
};
