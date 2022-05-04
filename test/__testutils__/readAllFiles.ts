import { resolve } from "node:path";
import { readFile } from "node:fs/promises";

/**
 * Bulk version of `readFile`
 *
 * @param paths - Paths to files
 * @param cwd - Current working directory
 *
 * @returns Read files as buffer array
 */
export const readAllFiles = async (
	paths: string[],
	cwd = "",
): Promise<Buffer[]> => {
	return await Promise.all(paths.map((path) => readFile(resolve(cwd, path))));
};
