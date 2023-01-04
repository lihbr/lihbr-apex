import { type LinkResolverFunction } from "@prismicio/client";

export const linkResolver: LinkResolverFunction = (doc) => {
	if (doc.isBroken) {
		return "/404";
	}

	switch (doc.type) {
		case "post__blog":
			return `/posts/${doc.uid}`;

		case "post__document":
			return `/${doc.uid}`;

		case "post__art":
			return `/art`;

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
