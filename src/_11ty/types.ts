// Eleventy types

export type EleventyShortcodeFunction = (
	name: string,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	callback: (...value: any[]) => string | null,
) => void;

export type EleventyPairedShortcodeFunction = (
	name: string,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	callback: (slot: string, ...value: any[]) => string | null,
) => void;

export type EleventyAddFilterFunction = (
	name: string,
	callback: (value: string) => string,
) => void;

export type EleventyConfig = {
	addPlugin: <TOptions>(
		plugin: (eleventyConfig: EleventyConfig, options?: TOptions) => void,
		options?: TOptions,
	) => void;
	addGlobalData: <TData = unknown>(
		name: string,
		data: () => Promise<TData> | TData,
	) => EleventyConfig;
	addFilter: EleventyAddFilterFunction;
	addShortcode: EleventyShortcodeFunction;
	addPairedShortcode: EleventyPairedShortcodeFunction;
	[key: string]: unknown;
};
