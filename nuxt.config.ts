import { readdir, readFile, writeFile } from "node:fs/promises"
import { join } from "node:path"

import tailwindcss from "@tailwindcss/vite"

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: "2026-05-13",
	devtools: { enabled: false },

	app: {
		head: {
			templateParams: {
				separator: "-",
			},
			link: [
				{ rel: "icon", type: "image/x-icon", href: "/favicon.ico", sizes: "32x32" },
				{ rel: "icon", type: "image/svg+xml", href: "/icon.svg" },
				{ rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
			],
		},
	},

	modules: ["@nuxtjs/seo", "@nuxt/content"],

	site: {
		url: "https://lihbr.com",
		name: "lihbr",
		defaultLocale: "en",
		indexable: true,
	},

	sitemap: {
		zeroRuntime: true,
		xsl: "/assets/sitemap.xsl",
		exclude: ["/card"],
	},

	seo: {
		fallbackTitle: false,
	},

	ogImage: false,

	content: {
		experimental: {
			sqliteConnector: "native",
		},
	},

	css: ["~/assets/css/index.css"],

	nitro: {
		prerender: {
			crawlLinks: true,
			routes: ["/", "/sitemap.xml"],
		},
	},

	hooks: {
		// `public/assets/sitemap.xsl` can't import fonts, so point its bare
		// `url("kuronuri-*.woff2")` references to the hashed client build files.
		"nitro:build:public-assets": async (nitro) => {
			const publicDir = nitro.options.output.publicDir
			const buildAssetsDir = nitro.options.runtimeConfig.app.buildAssetsDir
			const xslPath = join(publicDir, "assets/sitemap.xsl")

			const assets = await readdir(join(publicDir, buildAssetsDir))
			const xsl = (await readFile(xslPath, "utf8")).replace(
				/url\("(kuronuri-[\w-]+)\.woff2"\)/g,
				(_, name: string) => {
					const asset = assets.find(
						(file) => file.startsWith(`${name}.`) && file.endsWith(".woff2"),
					)
					if (!asset) {
						throw new Error(`sitemap.xsl: ${name}.woff2 not found in client build`)
					}

					return `url("${join(buildAssetsDir, asset)}")`
				},
			)

			await writeFile(xslPath, xsl)
		},
	},

	vite: {
		plugins: [tailwindcss()],
	},
})
