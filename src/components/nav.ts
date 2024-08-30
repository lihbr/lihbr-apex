import { heading } from "./heading"
import { preferences } from "./preferences"

export function nav(args: { currentPath: string }): string {
	const navItem = (item: { href: string, label: string }): string => {
		const ariaCurrent =
			args.currentPath === item.href ? " aria-current=\"page\"" : ""

		return /* html */ `
			<li>
				<a
					href="${item.href}"${ariaCurrent}
					class="current:text-theme underline"
				>
					${item.label}
				</a>
			</li>`
	}

	return /* html */ `
		<nav class="section space-y-6">
			${heading("Nav", { as: "h2", class: "heading-2 !text-inherit" })}
			<ul class="list-disc list-inside lowercase">
				${navItem({ label: "Talks", href: "/#talks" })}
				${navItem({ label: "Posts", href: "/#posts" })}
				${navItem({ label: "Art", href: "/art" })}
				${navItem({ label: "Projects", href: "/#projects" })}
				${navItem({ label: "Albums", href: "/albums" })}
				${navItem({ label: "About", href: "/about" })}
				${navItem({ label: "Contact", href: "/contact" })}
			</ul>
			${preferences()}
		</nav>`
}
