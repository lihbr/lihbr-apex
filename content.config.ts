import { defineCollection, defineContentConfig } from "@nuxt/content"
import { z } from "zod"

export default defineContentConfig({
	collections: {
		talks: defineCollection({
			type: "data",
			source: "talks/*.json",
			schema: z.object({
				slug: z.string(),
				title: z.string(),
				lead: z.string(),
				date: z.string(),
				durationMinutes: z.number(),
				conference: z.object({
					name: z.string(),
					url: z.string(),
					location: z.string(),
				}),
				links: z.array(z.object({
					name: z.string(),
					url: z.string(),
				})),
			}),
			indexes: [
				{ columns: ["slug"], unique: true },
			],
		}),
	},
})
