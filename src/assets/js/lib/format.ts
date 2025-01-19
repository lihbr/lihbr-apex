const dateFormat = {
	usDate: new Intl.DateTimeFormat("en-US", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	}),
	usDay: new Intl.DateTimeFormat("en-US", {
		weekday: "long",
	}),
	usTime: new Intl.DateTimeFormat("en-US", {
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
	}),
	usRelativeDays: new Intl.RelativeTimeFormat("en-US", {
		numeric: "auto",
	}),
} as const

export function dateToUSDate(rawDate: string | number): string {
	const date = new Date(rawDate)

	return dateFormat.usDate.format(date)
}

export function dateToUSDay(rawDate: string | number): string {
	const date = new Date(rawDate)

	return dateFormat.usDay.format(date)
}

export function dateToUSTime(rawDate: string | number): string {
	const date = new Date(rawDate)

	return dateFormat.usTime.format(date)
}

const ONE_DAY_MS = 1000 * 60 * 60 * 24
export function dateToUSRelativeDays(rawDate: string | number): string {
	const date = new Date(rawDate)
	const time = date.getTime()
	const to = time - (time % ONE_DAY_MS)

	const now = Date.now()
	const today = now - (now % ONE_DAY_MS)

	const diff = to - today
	const days = Math.floor(diff / ONE_DAY_MS)

	if (days >= 2) {
		return dateToUSDay(rawDate)
	}

	return dateFormat.usRelativeDays.format(days, "day")
}

const numberFormat = {
	us: new Intl.NumberFormat("en-US"),
} as const

export function numberToUS(rawNumber: number): string {
	return numberFormat.us.format(rawNumber)
}
