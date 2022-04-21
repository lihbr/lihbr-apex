/**
 * Import
 */
require("dotenv").config();
const fetch = require("isomorphic-unfetch");

const { request, response } = require("@lihbr/utils-netlify.lambda");

const Sentry = require("./utils/Sentry");

/**
 * Controller
 */
const ctrl = {
  POST: async event => {
    // Prevent spam
    try {
      request.throttle(event, "contact", 20);
    } catch (err) {
      return response.formatted.error({ status: 429, error: { err, headers: event.headers } });
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
    for (const key of ["name", "email", "body"]) {
      if (!body[key]) {
        return response.formatted.error({
          status: 400,
          msg: `body is missing field: "${key}"`
        });
      }
    }

    // Create Slack blocks
    const blocks = [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: ":mailbox: A new contact message has been submitted~"
        }
      },
      {
        type: "divider"
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: "*Name:*"
          },
          {
            type: "plain_text",
            text: body.name,
            emoji: true
          }
        ]
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: "*Email:*"
          },
          {
            type: "plain_text",
            text: body.email,
            emoji: true
          }
        ]
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "*Message:*"
        }
      },
      {
        type: "section",
        text: {
          type: "plain_text",
          text: body.body,
          emoji: true
        }
      }
    ];

    // Send Slack blocks
    try {
      await fetch(process.env.SLACK_CONTACT_WEBHOOK, {
        headers: {
          "content-type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({
          text: "A new contact message has been submitted~",
          blocks
        })
      });
    } catch (err) {
      console.error(err);
      Sentry.captureException(err);
      await Sentry.flush();
      return response.formatted.error({ status: 500 });
    }

    return response.formatted.success({ status: 200 });
  }
};

/**
 * Export
 */
exports.handler = (event, context, callback) =>
  request.route(event, context, callback, ctrl);
