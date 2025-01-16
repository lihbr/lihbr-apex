export function notIndexed(path: string, kind?: string): string {
	return /* html */ `<aside class="section space-y-6">
		<p class="border-2 border-theme p-2">
			This ${kind || "page"} is private. It is not indexed on <a href="/sitemap.xml" target="_blank" rel="noreferrer" class="underline">this website</a> or <a href="/robots.txt" target="_blank" rel="noreferrer" class="underline">by search engines</a><br />
			You can only access it through <a href="${path}" class="underline">its direct link</a>.
		</p>
	</aside>`
}
