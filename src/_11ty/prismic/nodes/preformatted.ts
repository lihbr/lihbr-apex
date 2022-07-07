import { HTMLMapSerializer } from "@prismicio/helpers";

import { prismFormat } from "../../lib/prismFormat";

/**
 * Prismic HTML serializer
 */
export const preformatted: HTMLMapSerializer["preformatted"] = ({ node }) => {
	return prismFormat(node.text);
};
