// TODO: Improve Sentry usage in functions
const Sentry = require("@sentry/node");

Sentry.init({
  dsn: process.env.SENTRY_DSN_LAMBDA,
  environment:
    process.env.NODE_ENV === "development" ? "development" : "production"
});

module.exports = Sentry;
