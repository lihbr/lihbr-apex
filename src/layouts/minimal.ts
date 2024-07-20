import { back } from "../components/back"
import { type BaseArgs, base } from "./base"

export function minimal(slot: string, args: BaseArgs & { backTo?: string }): string {
	return base(
		/* html */ `${back({ to: args.backTo })}
${slot}
${back({ to: args.backTo, withPreferences: true, class: "mb-16" })}`,
		args,
	)
}
