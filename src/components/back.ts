import { preferences } from "./preferences"

export function back(args?: {
	to?: string
	withPreferences?: boolean
	class?: string
}): string {
	return /* html */ `
		<nav class="section space-y-6${args?.class ? ` ${args.class}` : ""}">
			<p>
				<a href="${args?.to ?? "/"}" class="current:text-theme">
					&lt;- <span class="underline">back to ${args?.to?.substring(1) ?? "index"}</span>
				</a>
			</p>
			${args?.withPreferences ? preferences() : ""}
		</nav>`
}
