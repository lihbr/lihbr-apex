import { applyOnEvent } from "./lib/applyOnEvent";
import { applyMode, toggleMode } from "./lib/darkMode";

applyMode();

applyOnEvent("click", "toggle-mode", toggleMode);

console.log("base");
