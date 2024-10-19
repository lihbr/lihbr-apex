import { highlightStarryNight } from "../../akte/lib/highlightCode"
import { applyOnEvent } from "./lib/applyOnEvent"
import { htmlToBlob } from "./lib/htmlToBlob"
import "./_base"

// Textarea
const $input = document.querySelector("#input")
if (!$input) {
	throw new Error("Input element not found")
}

const $output = document.querySelector("#output")
if (!$output) {
	throw new Error("Output element not found")
}

const input = {
	$name: $input.querySelector("figcaption"),
	$code: $input.querySelector("code"),
}

const output = {
	$name: $output.querySelector("figcaption"),
	$code: $output.querySelector("code"),
}

async function copyContent(from: HTMLElement, to: HTMLElement, highlight = false) {
	if (highlight) {
		to.innerHTML = await highlightStarryNight(
			from.textContent ?? "",
			input.$name?.textContent?.split(".").pop() ?? "typescript",
		)
	} else {
		to.textContent = from.textContent
	}
}

async function copyName() {
	if (input.$name && output.$name) {
		input.$name.textContent = input.$name.textContent?.trim() ?? ""
		await copyContent(input.$name, output.$name)
		await copyCode()
	}
}

async function copyCode() {
	if (input.$code && output.$code) {
		await copyContent(input.$code, output.$code, true)
	}
}

function observe(input: HTMLElement, callback: () => void | Promise<void>) {
	const observer = new MutationObserver((mutations) => {
		mutations.forEach((mutation) => {
			if (mutation.type === "characterData" || mutation.type === "childList") {
				callback()
			}
		})
	})
	observer.observe(input, { characterData: true, subtree: true, childList: true })
}

function observeName() {
	if (input.$name && output.$name) {
		observe(input.$name, copyName)
	}
}

function observeCode() {
	if (input.$code && output.$code) {
		observe(input.$code, copyCode)
	}
}

copyName().then(() => {
	copyCode().then(() => {
		observeName()
		observeCode()
	})
})

// Configuration
const $preview = document.querySelector("#preview") as HTMLElement | null
if (!$preview) {
	throw new Error("Preview element not found")
}

const $innerPreview = document.querySelector("#inner-preview") as HTMLElement | null
if (!$innerPreview) {
	throw new Error("Inner preview element not found")
}

const $transparent = document.querySelector("#transparent")
if (!$transparent) {
	throw new Error("Transparent element not found")
}

const PADDINGS = ["0rem", "1.5rem", "3rem", "6rem"]

function applyPadding(padding: string): void {
	$preview!.style.padding = padding
}

function setPadding(event: Event): void {
	const padding = event.target instanceof HTMLInputElement && event.target.value

	if (padding && PADDINGS.includes(padding)) {
		applyPadding(padding)
	}
}

applyOnEvent("change", "set-padding", setPadding)

const SIZES = ["container", "fit", "2:1"] as const

function applySize(size: typeof SIZES[number]): void {
	switch (size) {
		case "container":
			$preview!.style.width = "auto"
			$preview!.style.aspectRatio = "auto"
			$innerPreview!.style.width = "39.5rem"
			break

		case "fit":
			$preview!.style.width = "auto"
			$preview!.style.aspectRatio = "auto"
			$innerPreview!.style.width = "auto"
			break

		case "2:1":
		default:
			$preview!.style.width = "100vw"
			$preview!.style.aspectRatio = "2 / 1"
			$innerPreview!.style.width = "auto"
			break
	}
}

function setSize(event: Event): void {
	const size = event.target instanceof HTMLInputElement && event.target.value

	if (size && SIZES.includes(size as typeof SIZES[number])) {
		applySize(size as typeof SIZES[number])
	}
}

applyOnEvent("change", "set-size", setSize)

function applyBackground(background: string): void {
	if (background === "transparent") {
		$preview!.style.background = ""
		$transparent?.classList.add("bg-grid")
	} else {
		$preview!.style.background = background
		$transparent?.classList.remove("bg-grid")
	}
}

function setBackground(event: Event): void {
	if (event.target instanceof HTMLSelectElement) {
		const background = event.target.value
		event.target.style.background = background
		applyBackground(background)
	}
}

// Export
applyOnEvent("change", "set-background", setBackground)

async function copyImage(event: Event): Promise<void> {
	event.preventDefault()

	const maybeBlob = await htmlToBlob($preview!)

	if (maybeBlob) {
		navigator.clipboard.write([
			new ClipboardItem({
				"image/png": maybeBlob,
			}),
		])

		if (event.target instanceof HTMLElement) {
			const value = event.target.textContent
			if (value) {
				event.target.textContent = value.replace("copy", "copied")
				setTimeout(() => {
					if (event.target instanceof HTMLElement) {
						const value = event.target.textContent
						if (value) {
							event.target.textContent = value.replace("copied", "copy")
						}
					}
				}, 600)
			}
		}
	}
}

applyOnEvent("click", "copy-image", copyImage)

async function downloadImage(event: Event): Promise<void> {
	event.preventDefault()

	const maybeBlob = await htmlToBlob($preview!)

	if (maybeBlob) {
		const url = URL.createObjectURL(maybeBlob)
		const a = document.createElement("a")
		a.href = url
		a.download = `${input.$name?.textContent ?? "code"}.png`
		a.click()
		URL.revokeObjectURL(url)
	}
}
applyOnEvent("click", "download-image", downloadImage)
