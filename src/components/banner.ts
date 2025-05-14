export function banner(slot: string): string {
	return /* html */ `<aside class="section space-y-6">
		<p class="border-2 border-theme p-2">
			${slot}
		</p>
	</aside>`
}
