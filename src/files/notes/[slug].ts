import type { GlobalData, NoteData } from "../../akte/types"

import { defineAkteFiles } from "akte"
import { readAllDataHTML } from "../../akte/data"
import { dateToUSDate } from "../../akte/date"
import { slugify } from "../../akte/slufigy"

import { heading } from "../../components/heading"

import { minimal } from "../../layouts/minimal"

export const slug = defineAkteFiles<GlobalData, ["slug"]>().from({
	path: "/notes/:slug",
	async bulkData() {
		const notes = await readAllDataHTML<{
			first_publication_date: string
			last_publication_date: string
		}>({ type: "notes" })

		const files: Record<string, NoteData> = {}
		for (const path in notes) {
			const title = path.split("/").pop()!.replace(".md", "")
			const data: NoteData = {
				...notes[path].matter,
				title,
				body: notes[path].html,
				links: {
					outbound: notes[path].links.outbound,
					inbound: {},
				},
			}

			files[`/notes/${slugify(title)}`] = data
		}

		// Compute inbound links
		for (const path in files) {
			const file = files[path]
			for (const outboundLink of file.links.outbound) {
				if (outboundLink in files) {
					files[outboundLink].links.inbound[path] = {
						path,
						title: file.title,
						first_publication_date: file.first_publication_date,
					}
				}
			}
		}

		return files
	},
	async render(context) {
		const note = context.data

		const dates = []
		dates.push(
			/* html */ `First published: <time datetime="${
				note.first_publication_date
			}">${dateToUSDate(note.first_publication_date)}</time>`,
		)
		if (note.first_publication_date !== note.last_publication_date) {
			dates.push(
				/* html */ `Last updated: <time datetime="${
					note.last_publication_date
				}">${dateToUSDate(note.last_publication_date)}</time>`,
			)
		}

		const body = /* html */ `
			<article class="section space-y-6 prose">
				${heading(note.title, { as: "h1" })}
				${note.body}
				<p>${dates.join("<br />\n")}</p>
			</article>`

		const inboundNotes = Object.values(note.links.inbound).sort(
			(note1, note2) =>
				note2.first_publication_date.localeCompare(
					note1.first_publication_date,
				),
		)

		const links = inboundNotes.length
			? /* html */ `
			<aside class="section space-y-6">
				${heading("Links to This Note", { as: "h2", class: "heading-2" })}
				<ul role="list">
					${inboundNotes
						.map((inboundNote) => {
							return /* html */ `
								<li class="flex gap-2">
									<time datetime="${inboundNote.first_publication_date}" class="ff-numeric">
										${dateToUSDate(inboundNote.first_publication_date)}
									</time>
									<a href="${inboundNote.path}" class="lowercase underline">
										${inboundNote.title}
									</a>
								</li>`
						})
						.join("\n")}
				</ul>
			</aside>`
			: null

		return minimal([body, links].filter(Boolean).join("\n"), {
			path: context.path,
			title: note.title,
		})
	},
})
