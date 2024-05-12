export function applyOnEvent(event: string,	callbackName: string,	callback: (event: Event) => void): void {
	document
		.querySelectorAll(`[data-on-${event}="${callbackName}"]`)
		.forEach((element: Element): void => {
			element.addEventListener(event, callback);
		});
}
