import { back } from "../components/back"
import { footer } from "../components/footer"

import { type BaseArgs, base } from "./base"

export function page(slot: string, args: BaseArgs & { backTo?: string }): string {
	return base(
		/* html */ `${back({ to: args.backTo })}
${slot}
${back({ to: args.backTo, withPreferences: true })}
${footer()}`,
		args,
	)
}
