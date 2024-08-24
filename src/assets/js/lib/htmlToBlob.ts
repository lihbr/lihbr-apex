/*
 ** Core logic from https://github.com/raycast/ray-so/blob/0b7b5c6f8ae78c055b9d1a71fcefe5ed4c1173f6/app/(navigation)/(code)/lib/image.ts
 ** Many thanks to @raycast
 */
import { toBlob } from "html-to-image"

const imageFilter = (node: HTMLElement) => node.tagName !== "TEXTAREA" && !node.dataset?.ignoreInExport

const htmlToImageOptions = {
	filter: imageFilter,
	pixelRatio: 2,
	skipAutoScale: true,
}

type BlobOptions = Parameters<typeof toBlob>[1]
export async function htmlToBlob(node: HTMLElement, options?: BlobOptions): Promise<Blob | null> {
	return toBlob(node, {
		...htmlToImageOptions,
		...options,
	})
}
