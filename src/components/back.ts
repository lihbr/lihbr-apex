import { preferences } from "./preferences";

export function back(args?: {
	withPreferences?: boolean;
	class?: string;
}): string {
	return /* html */ `
		<nav class="section space-y-6${args?.class ? ` ${args.class}` : ""}">
			<p>
				<a href="/" class="current:text-theme">&lt;- <span class="underline">back to index</span></a>
			</p>
			${args?.withPreferences ? preferences() : ""}
		</nav>`;
}
