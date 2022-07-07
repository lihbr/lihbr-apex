import { BlockOfType } from "../types";

export const divider = (_block: BlockOfType<"divider">): string => {
	return `<hr />`;
};
