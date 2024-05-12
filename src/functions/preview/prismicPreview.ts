import process from "node:process";

import type { HandlerEvent, HandlerResponse } from "@netlify/functions";
import * as prismic from "@prismicio/client";

import { getClient } from "../../akte/prismic";
import { app } from "./preview.akte.app";

const HTML_HEADERS = {
	"content-type": "text/html; charset=utf-8",
};

const ROBOTS_HEADERS = {
	"x-robots-tag": "noindex, nofollow",
};

export async function resolve(event: HandlerEvent): Promise<HandlerResponse | null> {
	const { token: previewToken, documentId: documentID } =
		event.queryStringParameters ?? {};

	if (!previewToken || !documentID) {
		return null;
	}

	const client = getClient();
	const href = await client.resolvePreviewURL({
		documentID,
		previewToken,
		defaultURL: "/",
	});

	const previewCookie = {
		[new URL(client.endpoint).host.replace(/\.cdn/i, "")]: {
			preview: previewToken,
		},
	};

	return {
		statusCode: 302,
		headers: {
			...ROBOTS_HEADERS,
			"location": `/preview${href}?preview=true`,
			"set-cookie": `${prismic.cookie.preview}=${encodeURIComponent(
				JSON.stringify(previewCookie),
			)}; Path=/${process.env.AWS_LAMBDA_FUNCTION_NAME ? "; Secure" : ""}`,
		},
	};
}

export async function get(event: HandlerEvent): Promise<HandlerResponse> {
	const cookie = event.headers.cookie ?? "";

	const repository = new URL(getClient().endpoint).host.replace(/\.cdn/i, "");

	const response: HandlerResponse = {
		statusCode: 500,
		headers: {
			...HTML_HEADERS,
			...ROBOTS_HEADERS,
		},
	};

	if (cookie.includes(repository)) {
		globalThis.document = globalThis.document || {};
		globalThis.document.cookie = cookie;
		app.clearCache(true);

		try {
			const file = await app.render(
				app.lookup(event.path.replace("/preview", "") ?? "/"),
			);
			response.statusCode = 200;
			response.body = file;
		} catch (error) {
			response.statusCode = 404;
			response.body = await app.render(app.lookup("/404"));
		}
	} else {
		response.statusCode = 202;
		response.body = await app.render(app.lookup("/preview"));
	}

	return response;
}
