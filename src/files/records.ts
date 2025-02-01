import type { GlobalData } from "../akte/types"

import { defineAkteFile } from "akte"
import { getAllReleasesSafely } from "../akte/discogs"

import { heading } from "../components/heading"

import { page } from "../layouts/page"

export const records = defineAkteFile<GlobalData>().from({
	path: "/records",
	async data() {
		const releases = await getAllReleasesSafely()

		return { releases }
	},
	render(context) {
		const hero = /* html */ `
			<header class="section space-y-6">
				${heading("Records", { as: "h1", class: "heading-1" })}
				<p>
					I collect vinyl records of artists I like.<br />
					Here's my humble collection.
				</p>
			</header>`

		const desktop = /* html */ `
			<div class="hidden lg:block mt-16 px-6">
				<table class="sort lowercase" aria-labelledby="sortInstructions">
					<caption id="sortInstructions" class="sr-only">Use column header buttons to sort</caption>
					<thead>
						<tr>
							<th class="w-2/5" data-sortable>
								<button class="lowercase" type="button" aria-labelledby="sortInstructions">Title</button>
							</th>
							<th class="w-1/5" data-sortable>
								<button class="lowercase" type="button" aria-labelledby="sortInstructions">Artist</button>
							</th>
							<th class="w-1/5" data-sortable>
								<button class="lowercase" type="button" aria-labelledby="sortInstructions">Genres</button>
							</th>
							<th class="w-[10%]" data-sortable="123">
								<button class="lowercase" type="button" aria-labelledby="sortInstructions">Year</button>
							</th>
							<th class="w-[10%]"></th>
						</tr>
					</thead>
					<tbody>
					${context.data.releases
						.map((release) => {
							const id = release.basic_information.id
							const image = release.basic_information.cover_image
							const title = release.basic_information.title
							const artist = release.basic_information.artists[0].name.replace(
								/\(\d+\)$/,
								"",
							)
							const genre = release.basic_information.genres.sort().join(", ")
							const year = release.basic_information.year

							return /* html */ `
							<tr class="relative group hover:bg-slate">
								<td class="truncate">
									<img
										src="${image}"
										alt="${title}'s cover"
										loading="lazy"
										class="h-64 hidden group-hover:block absolute bottom-[calc(100%+.5rem)] left-4 z-10 pointer-events-none"
									>
									${title}
								</td>
								<td class="truncate">${artist}</td>
								<td class="truncate">${genre}</td>
								<td>
									${year ? `<time datetime="${year}" class="ff-numeric">${year}</time>` : "n/a"}
								</td>
								<td class="text-right">
									<a class="underline" href="https://www.discogs.com/release/${id}" target="_blank" rel="noreferrer" title="Open on Discogs">Discogs</a>
								</td>
							</tr>`
						})
						.join("\n")}
					</tbody>
				</table>
			</div>`

		const mobile = /* html */ `
			<ul class="lg:hidden section space-y-16" role="list">
				${context.data.releases
					.map((release) => {
						const id = release.basic_information.id
						const image = release.basic_information.thumb
						const title = release.basic_information.title
						const artist = release.basic_information.artists[0].name.replace(
							/\(\d+\)$/,
							"",
						)
						const genre = release.basic_information.genres.sort().join(", ")
						const year = release.basic_information.year

						return /* html */ `
						<li>
							<img
								src="${image}"
								alt="${title}'s cover"
								loading="lazy"
								class="h-32"
							>
							<dl class="dl mt-6">
								<div>
									<dt>Title - Artist</dt>
									<dd>${title} - ${artist}</dd>
								</div>
								<div>
									<dt>Genre - Year</dt>
									<dd>
										${genre} - ${year ? `<time datetime="${year}">${year}</time>` : "n/a"}
									</dd>
								</div>
								<div>
									<br class="hidden sm:block"/>
									<a class="lowercase underline" href="https://www.discogs.com/release/${id}" target="_blank" rel="noreferrer" title="Open on Discogs">Discogs</a>
								</div>
							</dl>
						</li>`
					})
					.join("\n")}
			</ul>`

		return page([hero, desktop, mobile].join("\n"), {
			path: context.path,
			title: "Records",
			script: "/assets/js/records.ts",
		})
	},
})
