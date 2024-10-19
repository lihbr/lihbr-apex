import type { Buffer } from "node:buffer"
import { readFile } from "node:fs/promises"
import { resolve } from "node:path"

/**
 * Bulk version of `readFile`
 *
 * @param paths - Paths to files
 * @param cwd - Current working directory
 *
 * @returns Read files as buffer array
 */
export function readAllFiles(paths: string[],	cwd = ""): Promise<{ path: string, content: Buffer }[]> {
	return Promise.all(
		paths.map(async (path) => {
			return {
				path,
				content: await readFile(resolve(cwd, path)),
			}
		}),
	)
}
