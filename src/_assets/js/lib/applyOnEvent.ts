export const applyOnEvent = (
	event: string,
	callbackName: string,
	callback: () => void,
): void => {
	document
		.querySelectorAll(`[data-on-${event}="${callbackName}"]`)
		.forEach((element: Element): void => {
			element.addEventListener(event, callback);
		});
};
