const isDark = (): boolean => {
	return (
		localStorage.theme === "dark" ||
		(!("theme" in localStorage) &&
			window.matchMedia("(prefers-color-scheme: dark)").matches)
	);
};

export const applyMode = (): void => {
	if (isDark()) {
		document.documentElement.classList.add("dark");
	} else {
		document.documentElement.classList.remove("dark");
	}
};

export const toggleMode = (): void => {
	if (!isDark()) {
		localStorage.theme = "dark";
	} else {
		localStorage.theme = "light";
	}
	applyMode();
};
