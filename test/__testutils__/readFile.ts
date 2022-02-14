import { readFile as _readFile } from "node:fs";

/**
 * Promise-based version of `readFile`
 *
 * @param path - Path to file
 *
 * @returns Read file as buffer
 */
export const readFile = (path: string): Promise<Buffer> =>
	new Promise((resolve, reject) => {
		_readFile(path, (err, data) => {
			if (err) {
				reject(err);
			} else {
				resolve(data);
			}
		});
	});
