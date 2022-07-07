import { BlockOfType } from "../types";
import { richText } from "./richText";

export const callout = (block: BlockOfType<"callout">): string => {
	let attributes = "";

	if (block.callout.icon && block.callout.icon.type === "emoji") {
		attributes += ` data-emoji="${block.callout.icon.emoji}"`;
	}

	return `<aside class="callout"${attributes}>${richText(
		block.callout,
	)}</aside>`;
};
