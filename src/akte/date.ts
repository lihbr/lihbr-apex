const format = {
	us: new Intl.DateTimeFormat("en-US", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	}),
} as const;

export const dateToUSFormat = (rawDate: string | number): string => {
	const date = new Date(rawDate);

	return format.us.format(date);
};

export const dateToISOFormat = (rawDate: string | number): string => {
	const date = new Date(rawDate);

	return date.toISOString().replace(/\.\d\d\dZ$/, "+00:00");
};
