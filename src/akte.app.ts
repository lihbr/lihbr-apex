import type { GlobalData } from "./akte/types"

import { defineAkteApp } from "akte"

import { slug } from "./files/[slug]"
import { fourOFour } from "./files/404"

import { slug as albumsSlug } from "./files/albums/[slug]"
import { index as albums } from "./files/albums/index"

import { index as art } from "./files/art/index"
import { rss as artRSS } from "./files/art/rss"

import { code } from "./files/code"
import { colors } from "./files/colors"
import { index } from "./files/index"
import { meteo } from "./files/meteo"

import { slug as notesSlug } from "./files/notes/[slug]"
import { rss as notesRSS } from "./files/notes/rss"

import { slug as postsSlug } from "./files/posts/[slug]"
import { rss as postsRSS } from "./files/posts/rss"

import { slug as privateSlug } from "./files/private/[slug]"
import { records } from "./files/records"

import { sitemap } from "./files/sitemap"
import { slug as talksSlug } from "./files/talks/[conference]/[slug]"

import { poll as talksPoll } from "./files/talks/poll"
import { rss as talksRSS } from "./files/talks/rss"

export const app = defineAkteApp<GlobalData>({
	files: [
		fourOFour,
		sitemap,

		index,
		colors,
		records,
		code,
		meteo,
		slug,

		privateSlug,

		talksSlug,
		talksPoll,
		talksRSS,

		postsSlug,
		postsRSS,

		notesSlug,
		notesRSS,

		albums,
		albumsSlug,

		art,
		artRSS,
	],
	globalData() {
		return {}
	},
})
