import { LinkResolverFunction } from "@prismicio/client";

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
			return `/blog/${doc.uid}`;

		case "__eleventy":
			return (doc.url ?? "/").replace(".html", "");

		default:
			// Defaults to the root
			return "/";
	}
};
