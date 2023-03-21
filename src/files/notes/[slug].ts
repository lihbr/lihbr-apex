import { defineAkteFiles } from "akte";

import { slugify } from "../../akte/slufigy";
import { dateToUSFormat } from "../../akte/date";
import { readAllDataHTML } from "../../akte/data";
import type { GlobalData, NoteData } from "../../akte/types";

import { heading } from "../../components/heading";

import { page } from "../../layouts/page";

export const slug = defineAkteFiles<GlobalData, ["slug"]>().from({
	path: "/notes/:slug",
	async bulkData() {
		const notes = await readAllDataHTML<{ date: string }>({ type: "notes" });

		const files: Record<string, NoteData> = {};
		for (const path in notes) {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			const title = path.split("/").pop()!.replace(".md", "");
			const data: NoteData = {
				...notes[path].matter,
				title,
				body: notes[path].html,
				links: {
					outbound: notes[path].links.outbound,
					inbound: {},
				},
			};

			files[`/notes/${slugify(title)}`] = data;
		}

		// Compute inbound links
		for (const path in files) {
			const file = files[path];
			for (const outboundLink of file.links.outbound) {
				if (outboundLink in files) {
					files[outboundLink].links.inbound[path] = file.title;
				}
			}
		}

		return files;
	},
	async render(context) {
		const note = context.data;

		const slot = /* html */ `
			<article class="section space-y-6 prose">
				${heading(note.title, { as: "h1" })}
				${note.body}
				<p>
					Last updated: <time datetime="${note.date}">${dateToUSFormat(note.date)}</time>
				</p>
			</article>`;

		return page(slot, { path: context.path, title: note.title });
	},
});
