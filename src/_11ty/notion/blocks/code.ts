import { prismFormat } from "../../lib/prismFormat";
import { BlockOfType } from "../types";

export const code = (block: BlockOfType<"code">): string => {
	const language = block.code.language;
	const raw = block.code.rich_text.map((item) => item.plain_text).join("");

	return prismFormat(raw, language);
};
