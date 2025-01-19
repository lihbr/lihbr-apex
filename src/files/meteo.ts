import type { GlobalData } from "../akte/types"

import { defineAkteFile } from "akte"

import { heading } from "../components/heading"
import { minimal } from "../layouts/minimal"

export const meteo = defineAkteFile<GlobalData>().from({
	path: "/meteo",
	render(context) {
		const hero = /* html */ `
			<header class="section space-y-6">
				${heading("Meteo", { as: "h1", class: "heading-1" })}
				<p>
					Meteo around you.
				</p>
				<search>
					<form class="form space-y-2" action="/meteo" method="GET" data-on-submit="prevent-default">
						<label for="search" class="!normal-case">Search for a city -^</label>
						<input
							id="search"
							name="search"
							type="search"
							list="suggestions"
							data-on-input="suggest-locations"
							data-on-change="pick-location"
							placeholder="Tokyo, Cabourg, Monaco..."
						/>
						<datalist id="suggestions"></datalist>
						<p>Or <button class="underline" data-on-click="use-current-location">use current location</button> -&gt;</p>
					</form>
				</search>
			</header>`

		const forecast = /* html */ `<main></main>`

		return minimal(
			[hero, forecast].join("\n"),
			{ path: context.path, title: "Meteo", script: "/assets/js/meteo.ts" },
		)
	},
})
