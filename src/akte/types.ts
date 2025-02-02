import type * as prismic from "@prismicio/client"

export type GlobalData = Record<string, never>

export type TalkData = {
	slug: string
	title: string
	lead: string
	date: string
	durationMinutes: number
	hidden?: boolean
	conference: {
		slug: string
		name: string
		url: string
		location: string
	}
	links: {
		name: string
		url: string
	}[]
	feedback: {
		hashtags: string
		related: string
		via: string
	}
	confetti: string[]
}

export type NoteData = {
	title: string
	first_publication_date: string
	last_publication_date: string
	body: string
	links: {
		outbound: string[]
		inbound: Record<
			string,
			{ path: string, title: string, first_publication_date: string }
		>
	}
}

export type ProjectData = {
	slug: string
	title: string
	start: string
	active: boolean
	url: string
}

// eslint-disable-next-line unused-imports/no-unused-vars
const Shade = {
	900: "900",
	800: "800",
	700: "700",
	600: "600",
	500: "500",
	400: "400",
	300: "300",
	200: "200",
	100: "100",
	50: "50",
} as const
export type Shades = (typeof Shade)[keyof typeof Shade]

// eslint-disable-next-line unused-imports/no-unused-vars
const Color = {
	slate: "slate",
	cream: "cream",
	navy: "navy",
	beet: "beet",
	flamingo: "flamingo",
	ochre: "ochre",
	butter: "butter",
	mantis: "mantis",
} as const
export type Colors = (typeof Color)[keyof typeof Color]

export type ColorsData = {
	primary: Record<Colors, Shades[]>
}

export type DiscogsRelease = {
	id: number
	date_added: string
	rating: number
	basic_information: {
		id: number
		thumb: string
		cover_image: string
		title: string
		year: number
		artists: { name: string }[]
		genres: string[]
		styles: string[]
	}
}

export type ImgixJson = {
	Exif: {
		FocalLength?: number
		FocalLengthIn35mmFilm?: number
		ExposureTime?: number
		ISOSpeedRatings?: number
		FNumber?: number
		DateTimeOriginal?: string
		OffsetTimeOriginal?: string
	}
	TIFF: {
		Make?: string
		Model?: string
		DateTime?: string
	}
	XMP?: never
}

export type PrismicImage = prismic.ImageFieldImage<"filled"> & { tags: string[], json: ImgixJson }
