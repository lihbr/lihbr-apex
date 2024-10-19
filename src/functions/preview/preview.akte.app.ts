import type { GlobalData } from "../../akte/types"

import { defineAkteApp } from "akte"

import { slug } from "../../files/[slug]"
import { fourOFour } from "../../files/404"
import { slug as albumsSlug } from "../../files/albums/[slug]"
import { index as art } from "../../files/art/index"
import { slug as postsSlug } from "../../files/posts/[slug]"
import { preview } from "../../files/preview"
import { slug as privateSlug } from "../../files/private/[slug]"

export const app = defineAkteApp<GlobalData>({
	files: [preview, fourOFour, slug, privateSlug, postsSlug, albumsSlug, art],
	globalData() {
		return {}
	},
})
