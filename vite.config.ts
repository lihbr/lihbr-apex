import * as path from "node:path"

import akte from "akte/vite"
import getPort from "get-port"
import { listenAndWatch } from "listhen"
import { defineConfig } from "vite"

import { app } from "./src/akte.app"

export default defineConfig({
	root: path.resolve(__dirname, "src"),
	server: {
		proxy: {
			"^/admin.*": "http://localhost:5174",
			"^/api.*": "http://localhost:5174",
			"^/preview.*": "http://localhost:5174",
		},
	},
	build: {
		cssCodeSplit: false,
		emptyOutDir: true,
		outDir: path.resolve(__dirname, "dist"),
		rollupOptions: {
			output: {
				entryFileNames(chunkInfo) {
					// Files being the unique user of a script requires special handling
					// of their chunk name for Akte and Vite build to match
					if (chunkInfo.moduleIds.some((id) => id.endsWith(".ts"))) {
						return `assets/js/${chunkInfo.name.replace(".html", "")}.js`
					}

					return "assets/js/[name].js"
				},
				chunkFileNames: "assets/js/[name].js",
				assetFileNames(assetInfo) {
					const extension = assetInfo.name?.split(".").pop()

					switch (extension) {
						case "css":
							return "assets/css/[name][extname]"

						case "woff":
						case "woff2":
							return "assets/fonts/[name][extname]"

						default:
							return "assets/[name][extname]"
					}
				},
			},
		},
	},
	plugins: [
		akte({ app }),
		{
			name: "markdown:watch",
			configureServer(server) {
				// Hot reload on Markdown updates
				server.watcher.add("data/notes")
				server.watcher.on("change", (path) => {
					if (path.endsWith(".md")) {
						app.clearCache(true)
						server.ws.send({
							type: "full-reload",
						})
					}
				})
			},
		},
		{
			name: "functions:watch",
			async configureServer() {
				const port = await getPort({ port: 5174 })

				// Ensures we only run the secondary server once
				if (port === 5174) {
					listenAndWatch("./src/functions.server.ts", {
						port,
						autoClose: true,
						staticDirs: [],
					})
				}
			},
		},
	],
	test: {
		include: ["../test/**/*.test.ts"],
		coverage: {
			reporter: ["lcovonly", "text"],
		},
	},
})
