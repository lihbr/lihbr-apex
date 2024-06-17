import { defineAkteApp } from "akte"

import type { GlobalData } from "../../akte/types"

import { preview } from "../../files/preview"
import { fourOFour } from "../../files/404"
import { slug } from "../../files/[slug]"
import { slug as privateSlug } from "../../files/private/[slug]"
import { slug as postsSlug } from "../../files/posts/[slug]"
import { index as art } from "../../files/art/index"

export const app = defineAkteApp<GlobalData>({
	files: [preview, fourOFour, slug, privateSlug, postsSlug, art],
	globalData() {
		return {}
	},
})
