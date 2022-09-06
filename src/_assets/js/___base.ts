import { applyOnEvent } from "./lib/applyOnEvent";
import { toggleTheme } from "./lib/theme";
import { setAlignment } from "./lib/alignment";

applyOnEvent("click", "toggle-theme", toggleTheme);
applyOnEvent("click", "set-alignment", setAlignment);

console.log("base");
