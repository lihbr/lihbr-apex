import "./_base"
import { add } from "./lib/albums"

const title = document.querySelector("h1")?.textContent
const date = document.querySelector("time")?.getAttribute("datetime")
const slug = location.pathname.split("/").pop()

if (title && date && slug) {
	add({ title, date, slug })
}

const $article = document.querySelector("article")

if ($article) {
	let isDown = false
	let startX: number
	let scrollLeft: number

	$article.addEventListener("mousedown", (event) => {
		if (event.target instanceof HTMLAnchorElement) {
			return
		}
		event.preventDefault()
		isDown = true
		startX = event.pageX - $article.offsetLeft
		scrollLeft = $article.scrollLeft
	})

	window.addEventListener("mouseup", () => {
		isDown = false
	})

	window.addEventListener("mousemove", (event) => {
		if (!isDown) {
			return
		}
		event.preventDefault()
		const x = event.pageX - $article.offsetLeft
		const walk = (x - startX) * 3
		$article.scrollLeft = scrollLeft - walk
	})
}
