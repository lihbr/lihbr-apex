import type { GlobalData } from "../../../akte/types"

import process from "node:process"
import * as prismic from "@prismicio/client"
import { defineAkteFile } from "akte"

import { dateToUSDate } from "../../../akte/date"
import { getClient } from "../../../akte/prismic"
import { sha256 } from "../../../akte/sha256"

import { heading } from "../../../components/heading"

import { minimal } from "../../../layouts/minimal"

export const admin = defineAkteFile<GlobalData>().from({
	path: "/admin",
	async data() {
		let [docs, albums] = await Promise.all([
			getClient().getAllByType("post__document--private"),
			getClient().getAllByType("post__album"),
		])

		for (const doc of docs) {
			if (!doc.url) {
				throw new Error(
					`Unable to resolve URL for doc: ${JSON.stringify(doc)}`,
				)
			}
			doc.url = `${doc.url}-${await sha256(doc.uid!, process.env.PRISMIC_TOKEN!, 7)}`
		}
		docs = docs.sort((a, b) => b.first_publication_date.localeCompare(a.first_publication_date))

		for (const album of albums) {
			if (!album.url) {
				throw new Error(
					`Unable to resolve URL for album: ${JSON.stringify(album)}`,
				)
			}
			album.url = `${album.url}-${await sha256(album.uid!, process.env.PRISMIC_TOKEN!, 7)}`
		}
		albums = albums.sort((a, b) => b.data.published_date.localeCompare(a.data.published_date))

		return { albums, docs }
	},
	render(context) {
		const hero = /* html */ `
			<main class="section space-y-6">
				${heading("Admin", { as: "h1", class: "heading-1" })}
				<p>
					Manage private pages and data.
				</p>
			</main>`

		const tools = /* html */ `
			<section class="section space-y-6">
				${heading("Tools", { as: "h2", class: "heading-2" })}
				<p>
					Useful tools.
				</p>
				<p>
					<a href="/code" class="lowercase underline">Code</a> -
					<a href="/colors" class="lowercase underline">Colors</a> -
					<a href="/meteo" class="lowercase underline">Meteo</a> -
					<a href="/records" class="lowercase underline">Records</a>
				</p>
			</section>`

		const docs = /* html */ `
			<section class="section space-y-6">
				${heading("Documents", { as: "h2", class: "heading-2" })}
				<p>
					Private documents.
				</p>
				<ul role="list">
					${context.data.docs.map((doc) => {
						return /* html */ `
							<li class="flex gap-2">
								<time datetime="${doc.first_publication_date}" class="ff-numeric">
									${dateToUSDate(doc.first_publication_date)}
								</time>
								<a href="${doc.url}" class="lowercase underline">
									${prismic.asText(doc.data.title) || "unknown"}
								</a>
							</li>`
					}).join("\n")}
				</ul>
			</section>`

		const albums = /* html */ `
		<section class="section space-y-6">
			${heading("Albums", { as: "h2", class: "heading-2" })}
			<p>
				Private albums.
			</p>
			<ul role="list">
				${context.data.albums.map((album) => {
					return /* html */ `
						<li class="flex gap-2">
							<time datetime="${album.data.published_date}" class="ff-numeric">
								${dateToUSDate(album.data.published_date)}
							</time>
							<a href="${album.url}" class="lowercase underline">
								${prismic.asText(album.data.title) || "unknown"}
							</a>
						</li>`
				}).join("\n")}
			</ul>
		</section>`

		const script = /* html */ `<script>localStorage.admin="true"</script>`

		return minimal(
			[
				hero,
				tools,
				docs,
				albums,
				script,
			].join("\n"),
			{ path: context.path, title: "Admin" },
		)
	},
})
