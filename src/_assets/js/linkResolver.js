/**
 * Prismic link resolver
 *
 * @type {import("@prismicio/helpers").LinkResolverFunction}
 */
const linkResolver = (doc) => {
	if (doc.isBroken) {
		return "/404";
	}

	switch (doc.type) {
		case "page":
			return doc.uid === "home" ? "/" : `/${doc.uid}`;

		case "post__blog":
			return `/blog/${doc.uid}`;

		default:
			// Defaults to the root
			return "/";
	}
};

module.exports = linkResolver;
