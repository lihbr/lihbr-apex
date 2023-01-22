import { defineAkteFile } from "akte";

import { readDataJSON } from "../akte/data";
import { getPrettyContrastRatio } from "../akte/getPrettyContrastRatio";
import type { ColorsData, GlobalData } from "../akte/types";

import { heading } from "../components/heading";

import { page } from "../layouts/page";

export const colors = defineAkteFile<GlobalData>().from({
	path: "/colors",
	async data() {
		const colors = await readDataJSON<ColorsData>("colors.json");

		return { colors };
	},
	render(context) {
		const hero = /* html */ `
			<header class="section space-y-6">
				${heading("Colors", { as: "h1", class: "heading-1" })}
				<p>
					While far from perfect, here are the colors of lihbr.
				</p>
			</header>`;

		const colors = Object.entries(context.data.colors.all)
			.map(([color, shades]) => {
				const theme = ["slate", "cream"].includes(color) ? "neutral" : color;

				const formattedShades = Object.entries(shades)
					.map(([shade, value]) => {
						return /* html */ `
						<li>
							<figure>
								<svg class="w-full" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
									<rect width="128" height="128" fill="${value}"/>
								</svg>
							</figure>
							<dl class="mt-6">
								<dt class="sr-only">Shade</dt>
								<dd>${shade}</dd>
								<dt class="sr-only">Value</dt>
								<dd>
									<button title="Click to copy HEX value" data-on-click="copy" data-value="${value}">
										${value}
									</button>
								</dd>
								<dt class="sr-only">Contrast ratio</dt>
								<dd>
									<span class="dark:hidden">
										${getPrettyContrastRatio(context.data.colors.all.cream["900"], value)}:1
									</span>
									<span class="hidden dark:inline">
										${getPrettyContrastRatio(context.data.colors.all.slate["900"], value)}:1
									</span>
								</dd>
							</dl>
						</li>`;
					})
					.join("\n");

				return /* html */ `
					<section class="px-6 mt-16 space-y-6 ${theme}">
						${heading(color, { as: "h2", class: "heading-2" })}
						<ul class="grid grid-cols-[repeat(auto-fit,minmax(6rem,1fr))] gap-x-6 gap-y-16">
							${formattedShades}
						</ul>
					</section>`;
			})
			.join("\n");

		return page([hero, colors].join("\n"), {
			path: context.path,
			title: "Colors",
			script: "/assets/js/colors.ts",
		});
	},
});
