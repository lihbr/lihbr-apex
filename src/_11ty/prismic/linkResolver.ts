import { type LinkResolverFunction } from "@prismicio/client";

export const linkResolver: LinkResolverFunction = (doc) => {
	if (doc.isBroken) {
		return "/404";
	}

	switch (doc.type) {
		case "page":
			if (doc.uid && ["home", "index"].includes(doc.uid)) {
				return process.env.ELEVENTY_SERVERLESS_PRISMIC_PREVIEW ? "/index" : "/";
			} else {
				return `/${doc.uid}`;
			}

		case "post__blog":
			return `/posts/${doc.uid}`;

		case "post__document":
			return `/${doc.uid}`;

		case "post__art":
		case "settings":
		case "settings__pages":
		case "taxonomy__category":
		case "taxonomy__color":
			// Default to homepage for documents with no dedicate pages
			return "/";

		case "__eleventy":
			return (doc.url ?? "/").replace(".html", "");

		default:
			throw new Error(`Unable to resolve URL for link: ${JSON.stringify(doc)}`);
	}
};
