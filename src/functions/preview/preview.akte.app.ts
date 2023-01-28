import { defineAkteApp } from "akte";

import type { GlobalData } from "../../akte/types";

import { preview } from "../../files/preview";
import { fourOFour } from "../../files/404";
import { slug } from "../../files/[slug]";
import { slug as postsSlug } from "../../files/posts/[slug]";

export const app = defineAkteApp<GlobalData>({
	files: [preview, fourOFour, slug, postsSlug],
	globalData() {
		return {};
	},
});
