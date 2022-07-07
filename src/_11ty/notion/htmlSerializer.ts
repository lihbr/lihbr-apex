import { AnyBlock } from "./types";

import {
	paragraph,
	heading_1,
	heading_2,
	heading_3,
	quote,
	callout,
	image,
	code,
	divider,
} from "./blocks";

const serializers: Record<string, (block: any) => string> = {
	paragraph,
	heading_1,
	heading_2,
	heading_3,
	quote,
	callout,
	image,
	code,
	divider,
};

export const htmlSerializer = (blocks: AnyBlock[]): string => {
	return blocks
		.map((block) => {
			if ("type" in block && block.type in serializers) {
				return serializers[block.type](block);
			}
			console.log(block);
		})
		.filter(Boolean)
		.join("\n");
};
