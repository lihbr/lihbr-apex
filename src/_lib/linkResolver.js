/**
 * Prismic link resolver
 */
module.exports = (doc) => {
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
