import kuronuri20Italic from "@lihbr/kuronuri/files/kuronuri-20-latin-400-italic.woff2?url"
import kuronuri20Normal from "@lihbr/kuronuri/files/kuronuri-20-latin-400-normal.woff2?url"
import kuronuri35Italic from "@lihbr/kuronuri/files/kuronuri-35-latin-400-italic.woff2?url"
import kuronuri35Normal from "@lihbr/kuronuri/files/kuronuri-35-latin-400-normal.woff2?url"

export default defineNuxtPlugin(() => {
	useHead({
		link: [kuronuri35Italic, kuronuri35Normal, kuronuri20Italic, kuronuri20Normal].map((href) => ({
			rel: "preload",
			href,
			as: "font",
			type: "font/woff2",
			crossorigin: "anonymous",
		})),
	})
})
