import { back } from "../components/back"
import { footer } from "../components/footer"

import { type BaseArgs, base } from "./base"

export function page(slot: string, args: BaseArgs): string {
	return base(
		/* html */ `${back()}
${slot}
${back({ withPreferences: true })}
${footer()}`,
		args,
	)
}
