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
				{ rel: "preload", href: "/assets/fonts/redaction-35-italic.woff2", as: "font", type: "font/woff2", crossorigin: "anonymous" },
			],
		},
	},

	modules: ["@nuxtjs/seo", "@nuxt/content", "@nuxtjs/plausible"],

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

	plausible: {
		apiHost: "/p7e",
		autoOutboundTracking: true,
	},

	css: ["~/assets/css/index.css"],

	nitro: {
		prerender: {
			crawlLinks: true,
			routes: ["/", "/sitemap.xml"],
		},
	},

	vite: {
		plugins: [
			tailwindcss(),
		],
	},
})
