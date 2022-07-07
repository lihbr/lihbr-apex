import { richTextMacro } from "./richText";

export const paragraph = richTextMacro<"paragraph">(
	(block) => block.paragraph,
	"p",
);

export const heading_1 = richTextMacro<"heading_1">(
	(block) => block.heading_1,
	"h2",
);

export const heading_2 = richTextMacro<"heading_2">(
	(block) => block.heading_2,
	"h3",
);

export const heading_3 = richTextMacro<"heading_3">(
	(block) => block.heading_3,
	"h4",
);

export const quote = richTextMacro<"quote">(
	(block) => block.quote,
	"blockquote",
);

export { callout } from "./callout";
export { image } from "./image";
export { code } from "./code";
export { divider } from "./divider";
