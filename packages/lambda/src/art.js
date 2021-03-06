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
      request.throttle(event, "art", 20);
    } catch (err) {
      return response.formatted.error({ status: 429 });
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
    for (const key of [
      "credit_artist_name",
      "credit_artist_link",
      "credit_artist_details"
    ]) {
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
          text: ":art: A new art has been submitted~"
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
            text: "*Artist:*"
          },
          {
            type: "plain_text",
            text: body.credit_artist_name,
            emoji: true
          }
        ]
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: "*Artist link:*"
          },
          {
            type: "plain_text",
            text: body.credit_artist_link.href,
            emoji: true
          }
        ]
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "*About:*"
        }
      },
      {
        type: "section",
        text: {
          type: "plain_text",
          text: body.credit_artist_details,
          emoji: true
        }
      }
    ];

    if (body.credit_submitter_name) {
      blocks.push({
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: "*Submitter:*"
          },
          {
            type: "plain_text",
            text: body.credit_submitter_name,
            emoji: true
          }
        ]
      });
    }

    if (body.credit_submitter_link && body.credit_submitter_link.href) {
      blocks.push({
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: "*Submitter link:*"
          },
          {
            type: "plain_text",
            text: body.credit_submitter_link.href,
            emoji: true
          }
        ]
      });
    }

    // Send Slack blocks
    try {
      await fetch(process.env.SLACK_ART_WEBHOOK, {
        headers: {
          "content-type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({
          text: "A new art has been submitted~",
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
