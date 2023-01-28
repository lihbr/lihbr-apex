export const preferences = (): string => {
	return /* html */ `
		<button data-on-click="toggle-theme" aria-live="polite" class="underline">
			<span class="inline dark:hidden">Fancy a dark theme?</span>
			<span class="hidden dark:inline">Fancy a light theme?</span>
		</button>
		<p aria-live="polite" class="!mt-0 hidden md:block">
			Change alignement to
			<button data-on-click="set-alignment" data-alignment="left" class="left:hidden underline">left</button><span class="left:hidden center:hidden"> or </span><button data-on-click="set-alignment" data-alignment="center" class="center:hidden underline">center</button><span class="right:hidden"> or </span><button data-on-click="set-alignment" data-alignment="right" class="right:hidden underline">right</button>.
		</p>`;
};
