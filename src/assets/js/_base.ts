import { applyOnEvent } from "./lib/applyOnEvent"
import { toggleTheme } from "./lib/theme"
import { setAlignment } from "./lib/alignment"
import { trackEvent } from "./lib/plausible"

applyOnEvent("click", "toggle-theme", toggleTheme)
applyOnEvent("click", "set-alignment", setAlignment)

// Page view
trackEvent({ event: "pageView" })

// 2-minute page time goal
setTimeout(async () => {
	await trackEvent({ event: "pageTime:120" })
}, 2 * 60 * 1000)

// Outbound links (using custom solution because Plausible implementation has issues)
document.querySelectorAll("a").forEach((node) => {
	if (node.host !== location.host) {
		const trackOutboundLink = (event: MouseEvent) => {
			trackEvent({
				event: "outboundLink:click",
				props: { url: node.href },
			})

			if (!node.target) {
				event.preventDefault()
				setTimeout(() => {
					location.href = node.href
				}, 150)
			}
		}
		node.addEventListener("click", trackOutboundLink)
		node.addEventListener("auxclick", (event) => {
			if (event.button === 1) {
				trackOutboundLink(event)
			}
		})
	}
})
