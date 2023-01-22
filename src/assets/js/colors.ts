import { applyOnEvent } from "./lib/applyOnEvent";
import { copy } from "./lib/copy";
import "./_base";

applyOnEvent("click", "copy", copy);
