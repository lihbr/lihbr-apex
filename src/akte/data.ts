import * as path from "node:path";
import * as fs from "node:fs/promises";
import { globby } from "globby";

const dataDir = path.resolve(__dirname, "../../data");

export const readData = (file: string): Promise<string> => {
	return fs.readFile(path.resolve(dataDir, file), "utf-8");
};

export const readDataJSON = async <TData>(file: string): Promise<TData> => {
	const data = await readData(file);

	return JSON.parse(data);
};

type ReadAllDataArgs = {
	type: "notes" | "projects" | "talks";
};

export const readAllData = async (
	args: ReadAllDataArgs,
): Promise<Record<string, string>> => {
	const files = await globby(`${args.type}/*`, { cwd: dataDir });

	const readPromises = files.map(async (file) => {
		return [file, await readData(file)] as const;
	});
	const entries = await Promise.all(readPromises);

	return Object.fromEntries(entries);
};

export const readAllDataJSON = async <TData>(
	args: ReadAllDataArgs,
): Promise<Record<string, TData>> => {
	const allData = await readAllData(args);

	const allDataJSON: Record<string, TData> = {};

	for (const file in allData) {
		allDataJSON[file] = JSON.parse(allData[file]);
	}

	return allDataJSON;
};
