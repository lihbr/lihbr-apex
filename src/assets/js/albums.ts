import { read } from "./lib/albums"
import { dateToUSFormat } from "./lib/format"
import "./_base"

const albums = read()
const $main = document.querySelector("article")

if ($main) {
	if (!albums.length) {
		$main.innerHTML = /* html */ `<aside class="border-2 border-theme p-2">No album found, maybe <a href="/contact" class="underline">ask Lucie</a> to share one with you?</aside>`
	} else {
		$main.innerHTML = /* html */ `
<ul role="list">
	${albums.map((album) => {
		return /* html */ `
			<li class="flex gap-2">
				<time datetime="${album.date}" class="ff-numeric">
					${dateToUSFormat(album.date)}
				</time>
				<a href="/albums/${album.slug}" class="lowercase underline">
					${album.title}
				</a>
			</li>`
	}).join("\n")}
</ul>
		`
	}
}
