// TODO: Improve Sentry usage in functions
const Sentry = require("@sentry/node");

Sentry.init({
  dsn: process.env.SENTRY_DSN_LAMBDA,
  release: process.env.COMMIT_REF,
  environment: (() => {
    if (process.env.NETLIFY) {
      return process.env.BRANCH === "master"
        ? "production"
        : process.env.BRANCH.replace(/[\/\s]/g, "-");
    } else {
      return "development";
    }
  })()
});

module.exports = Sentry;
