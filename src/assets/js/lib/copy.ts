export function copy(event: Event): void {
	event.preventDefault();

	const $target = event.target;

	if (!($target instanceof HTMLElement)) {
		return;
	}

	const value = $target.dataset.value;

	if (!value) {
		return;
	}

	navigator.clipboard?.writeText(value);

	$target.textContent = "copied";
	setTimeout(() => {
		$target.textContent = value;
	}, 600);
}
