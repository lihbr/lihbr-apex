import type { GlobalData } from "../../akte/types"

import { defineAkteApp } from "akte"

import { fourOFour } from "../../files/404"
import { admin } from "./files/admin"

export const app = defineAkteApp<GlobalData>({
	files: [fourOFour, admin],
	globalData() {
		return {}
	},
})
