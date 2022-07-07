import { BlockOfType } from "../types";

export const image = (block: BlockOfType<"image">): string => {
	const src =
		block.image.type === "external"
			? block.image.external.url
			: block.image.file.url;

	return `<img src="${src}" alt="${block.image.caption}" />`;
};
