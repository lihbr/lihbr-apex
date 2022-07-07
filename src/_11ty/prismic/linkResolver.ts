import { LinkResolverFunction } from "@prismicio/helpers";

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

		default:
			// Defaults to the root
			return "/";
	}
};
