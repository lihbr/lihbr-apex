import { back } from "../components/back";
import { type BaseArgs, base } from "./base";

export const minimal = (slot: string, args: BaseArgs): string => {
	return base(
		/* html */ `${back()}
${slot}
${back({ withPreferences: true })}`,
		args,
	);
};
