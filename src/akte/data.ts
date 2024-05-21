import * as path from "node:path"
import * as fs from "node:fs/promises"
import { globby } from "globby"

import { markdownToHTML } from "./lib/markdownToHTML"

const dataDir = path.resolve(__dirname, "../../data")

export function readData(file: string): Promise<string> {
	return fs.readFile(path.resolve(dataDir, file), "utf-8")
}

export async function readDataJSON<TData>(file: string): Promise<TData> {
	const data = await readData(file)

	return JSON.parse(data)
}

type ReadAllDataArgs = {
	type: "notes" | "projects" | "talks"
}

export async function readAllData(args: ReadAllDataArgs): Promise<Record<string, string>> {
	const files = await globby(`${args.type}/*`, { cwd: dataDir })

	const entries = await Promise.all(
		files.map(async (file) => {
			return [file, await readData(file)] as const
		}),
	)

	return Object.fromEntries(entries)
}

export async function readAllDataJSON<TData>(args: ReadAllDataArgs): Promise<Record<string, TData>> {
	const allData = await readAllData(args)

	const allDataJSON: Record<string, TData> = {}

	for (const file in allData) {
		allDataJSON[file] = JSON.parse(allData[file])
	}

	return allDataJSON
}

type ReadAllHTMLReturnType<TMatter extends Record<string, unknown>> = Record<
	string,
	{
		matter: TMatter
		links: {
			outbound: string[]
		}
		html: string
	}
>

export async function readAllDataHTML<TMatter extends Record<string, unknown>>(args: ReadAllDataArgs): Promise<ReadAllHTMLReturnType<TMatter>> {
	const allData = await readAllData(args)

	const allDataHTML: ReadAllHTMLReturnType<TMatter> = {}

	await Promise.all(
		Object.entries(allData).map(async ([file, body]) => {
			allDataHTML[file] = await markdownToHTML<TMatter>(body)
		}),
	)

	return allDataHTML
}
