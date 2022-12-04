import { HTMLMapSerializer } from "@prismicio/client";

export const htmlSerializer: HTMLMapSerializer = {
	preformatted: (node) => node.text,
};
