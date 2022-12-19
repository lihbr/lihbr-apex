// Eleventy types

export type EleventyAddShortcodeFunction = <T = string | null>(
	name: string,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	callback: (...value: any[]) => T,
) => void;

export type EleventyAddAsyncShortcodeFunction = <T = string | null>(
	name: string,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	callback: (...value: any[]) => Promise<T>,
) => void;

export type EleventyAddPairedShortcodeFunction = <T = string | null>(
	name: string,
	callback: (
		slot: string,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		...value: any[]
	) => T,
) => void;

export type EleventyAddAsyncPairedShortcodeFunction = <T = string | null>(
	name: string,
	callback: (
		slot: string,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		...value: any[]
	) => Promise<T>,
) => void;

export type EleventyAddFilterFunction = (
	name: string,
	callback: (value: string) => string,
) => void;

export type EleventyAddAsyncFilterFunction = (
	name: string,
	callback: (value: string) => Promise<string>,
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
	addAsyncFilter: EleventyAddAsyncFilterFunction;
	addShortcode: EleventyAddShortcodeFunction;
	addAsyncShortcode: EleventyAddAsyncShortcodeFunction;
	addPairedShortcode: EleventyAddPairedShortcodeFunction;
	addAsyncPairedShortcode: EleventyAddAsyncPairedShortcodeFunction;
	[key: string]: unknown;
};
