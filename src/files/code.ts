import { defineAkteFile } from "akte"

import type { Colors, ColorsData, GlobalData, Shades } from "../akte/types"

import { heading } from "../components/heading"

import { minimal } from "../layouts/minimal"
import { readDataJSON } from "../akte/data"

export const code = defineAkteFile<GlobalData>().from({
	path: "/code",
	async data() {
		const colors = await readDataJSON<ColorsData>("colors.json")

		return { colors }
	},
	render(context) {
		const slot = /* html */ `
			<header class="section space-y-6">
				${heading("Code Images", { as: "h1", class: "heading-1" })}
				<p>
					Create <span class="line-through">beautiful</span> <em>lihbr</em> images of your code.
				</p>
			</header>
			<form class="space-y-6">
				<fieldset class="section space-y-2">
					<p>
						Change padding to
						<input type="radio" name="padding" id="padding-0" value="0rem" data-on-change="set-padding" class="sr-only peer/padding-0" />
						<label for="padding-0" class="inline underline cursor-pointer peer-checked/padding-0:no-underline peer-checked/padding-0:cursor-auto">0px</label>,
						<input type="radio" name="padding" id="padding-1-5" value="1.5rem" data-on-change="set-padding" class="sr-only peer/padding-1-5" />
						<label for="padding-1-5" class="inline underline cursor-pointer peer-checked/padding-1-5:no-underline peer-checked/padding-1.5:cursor-auto">24px</label>,
						<input type="radio" name="padding" id="padding-3" value="3rem" data-on-change="set-padding"  class="sr-only peer/padding-3" checked />
						<label for="padding-3" class="inline underline cursor-pointer peer-checked/padding-3:no-underline peer-checked/padding-3:cursor-auto">48px</label>, or
						<input type="radio" name="padding" id="padding-6" value="6rem" data-on-change="set-padding" class="sr-only peer/padding-6" />
						<label for="padding-6" class="inline underline cursor-pointer peer-checked/padding-6:no-underline peer-checked/padding-6:cursor-auto">96px</label>.
					</p>
					<p>
						Resize to
						<input type="radio" name="size" id="size-container" value="container" data-on-change="set-size" class="sr-only peer/size-container" checked />
						<label for="size-container" class="inline underline cursor-pointer peer-checked/size-container:no-underline peer-checked/size-container:cursor-auto">container</label>,
						<input type="radio" name="size" id="size-fit" value="fit" data-on-change="set-size" class="sr-only peer/size-fit" />
						<label for="size-fit" class="inline underline cursor-pointer peer-checked/size-fit:no-underline peer-checked/size-fit:cursor-auto">fit-content</label>, or
						<input type="radio" name="size" id="size-2-1" value="2:1" data-on-change="set-size" class="sr-only peer/size-2-1" />
						<label for="size-2-1" class="inline underline cursor-pointer peer-checked/size-2-1:no-underline peer-checked/size-2-1:cursor-auto">2:1ar</label>
					</p>
					<p>
						<label for="background">Set background to</labl>
						<select id="background" name="background" data-on-change="set-background" class="inline action">
							<option value="transparent" selected>transparent</option>
							${Object.keys(context.data.colors.primary).map((color) => {
								const shades: Shades[] = color === "slate" || color === "cream" ? ["900", "800"] : ["900", "400", "100"]

								return shades.map((shade) => {
									const value = context.data.colors.all[color as Colors][shade]
									return /* html */ `<option value="${value}" style="color: ${value}; background: ${value};">${color} - ${shade}</option>`
								})
							})}
						</select>
					</p>
				</fieldset>
				<fieldset class="flex justify-center items-center">
					<div id="preview" class="relative flex justify-center items-center" style="padding: 3rem;">
						<div id="transparent" class="bg-grid absolute inset-0" data-ignore-in-export="true"></div>
						<div id="inner-preview" class="relative mx-auto" style="width: 39.5rem;">
							<figure id="input" class="!absolute !overflow-visible inset-0 z-10 highlight cursor-text">
								<figcaption class="min-h-[calc(1lh+.5rem)] outline-none !text-transparent !bg-transparent caret-cream" contenteditable="plaintext-only" autocomplete="off" autocorrect="off" spellcheck="false" autocapitalize="off" data-enable-grammarly="false">akte.app.ts</figcaption>
								<div class="highlightWrapper !bg-transparent">
									<pre class="min-h-[calc(1lh+1.5rem)]"><code class="outline-none text-wrap break-all min-h-[1lh] !text-transparent caret-cream block" contenteditable="plaintext-only" autocomplete="off" autocorrect="off" spellcheck="false" autocapitalize="off" data-enable-grammarly="false">import { defineAkteApp } from "akte"

export const app = defineAkteApp({
	files: [],
})</code></pre>
								</div>
							</figure>
							<figure id="output" class="highlight pointer-events-none" tabindex="-1">
								<figcaption class="min-h-[calc(1lh+.5rem)]"></figcaption>
								<div class="highlightWrapper">
									<pre class="min-h-[calc(1lh+1.5rem)]"><code class="text-wrap break-all">



									</code></pre>
								</div>
							</figure>
						</div>
					</div>
				</fieldset>
				<fieldset class="section space-y-2">
					<p>
					<button data-on-click="download-image" class="underline">Download image</button> or
						<button data-on-click="copy-image" class="underline">copy it to your clipboard</button>.
					</p>
				</fieldset>
			</form>
			<article class="section space-y-6"></article>
			`

		return minimal(slot, { path: context.path, title: "Code Images", script: "/assets/js/code.ts" })
	},
})
