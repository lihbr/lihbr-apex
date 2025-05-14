import { banner } from "./banner"

export function notIndexed(path: string, kind?: string): string {
	return banner(/* html */ `This ${kind || "page"} is private. It is not indexed on <a href="/sitemap.xml" target="_blank" rel="noreferrer" class="underline">this website</a> or <a href="/robots.txt" target="_blank" rel="noreferrer" class="underline">by search engines</a><br />
			You can only access it through <a href="${path}" class="underline">its direct link</a>.`)
}
