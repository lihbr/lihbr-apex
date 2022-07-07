import { BlockOfType, RichTextObject } from "../types";

const serializers: Record<string, (item: any) => string> = {
	text: (
		item: Extract<RichTextObject["rich_text"][number], { type: "text" }>,
	): string => {
		return item.text.link
			? `<a href="${item.text.link.url}">${item.text.content}</a>`
			: item.text.content;
	},
};

export const richText = (richTextObject: RichTextObject): string => {
	const { rich_text } = richTextObject;

	return rich_text
		.map((item) => {
			if (item.type in serializers) {
				const result = serializers[item.type](item);

				if (item.annotations.code) {
					return `<code class="inline">${result}</code>`;
				}

				const classes: string[] = [];

				if (item.annotations.strikethrough) {
					classes.push("line-through");
				}
				if (item.annotations.underline) {
					classes.push("underline");
				}
				if (item.annotations.italic) {
					classes.push("italic");
				} else if (classes.length) {
					classes.push("not-italic");
				}

				if (item.annotations.bold) {
					return `<strong${
						classes.length ? ` class="${classes.join(" ")}"` : ""
					}>${result}</strong>`;
				} else if (classes.length) {
					return `<em class="${classes.join(" ")}">${result}</em>`;
				}

				return result;
			}
		})
		.filter(Boolean)
		.join("");
};

type AllowedTypes =
	| "paragraph"
	| "heading_1"
	| "heading_2"
	| "heading_3"
	| "quote";

export const richTextMacro = <TType extends AllowedTypes>(
	retriever: (block: BlockOfType<TType>) => RichTextObject,
	wrapper: string,
): ((block: BlockOfType<TType>) => string) => {
	return (block: BlockOfType<TType>): string => {
		return `<${wrapper}>${richText(retriever(block))}</${wrapper}>`;
	};
};
