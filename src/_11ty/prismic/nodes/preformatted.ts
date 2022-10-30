import { HTMLMapSerializer } from "@prismicio/client";

import { prismFormat } from "../../lib/prismFormat";

/**
 * Prismic HTML serializer
 */
export const preformatted: HTMLMapSerializer["preformatted"] = ({ node }) => {
	return prismFormat(node.text);
};
