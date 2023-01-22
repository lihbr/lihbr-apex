import { defineAkteApp } from "akte";

import type { GlobalData } from "./akte/types";

import { fourOFour } from "./files/404";
import { sitemap } from "./files/sitemap";
import { index } from "./files/index";
import { colors } from "./files/colors";
import { records } from "./files/records";
import { slug } from "./files/[slug]";

import { slug as talksSlug } from "./files/talks/[conference]/[slug]";
import { poll as talksPoll } from "./files/talks/poll";
import { rss as talksRSS } from "./files/talks/rss";

import { slug as postsSlug } from "./files/posts/[slug]";
import { rss as postsRSS } from "./files/posts/rss";

import { index as art } from "./files/art/index";
import { rss as artRSS } from "./files/art/rss";

import { index as contact } from "./files/contact/index";
import { thanks as contactThanks } from "./files/contact/thanks";

export const app = defineAkteApp<GlobalData>({
	files: [
		fourOFour,
		sitemap,
		index,
		colors,
		records,
		slug,
		talksSlug,
		talksPoll,
		talksRSS,
		postsSlug,
		postsRSS,
		art,
		artRSS,
		contact,
		contactThanks,
	],
	globalData() {
		return {};
	},
});
