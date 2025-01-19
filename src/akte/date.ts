const format = {
	usDate: new Intl.DateTimeFormat("en-US", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	}),
} as const

export function dateToUSDate(rawDate: string | number): string {
	const date = new Date(rawDate)

	return format.usDate.format(date)
}

export function dateToISO(rawDate: string | number): string {
	const date = new Date(rawDate)

	return date.toISOString().replace(/\.\d\d\dZ$/, "+00:00")
}
