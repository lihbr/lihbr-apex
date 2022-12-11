import { applyOnEvent } from "./lib/applyOnEvent";
import { toggleTheme } from "./lib/theme";
import { setAlignment } from "./lib/alignment";
import { trackEvent } from "./lib/plausible";

applyOnEvent("click", "toggle-theme", toggleTheme);
applyOnEvent("click", "set-alignment", setAlignment);

setTimeout(async () => {
	await trackEvent({ event: "pageTime:120" });
}, 2 * 60 * 1000);
