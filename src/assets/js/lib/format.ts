const dateFormat = {
	us: new Intl.DateTimeFormat("en-US", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	}),
} as const

export function dateToUSFormat(rawDate: string | number): string {
	const date = new Date(rawDate)

	return dateFormat.us.format(date)
}

const numberFormat = {
	us: new Intl.NumberFormat("en-US"),
} as const

export function numberToUSFormat(rawNumber: number): string {
	return numberFormat.us.format(rawNumber)
}
