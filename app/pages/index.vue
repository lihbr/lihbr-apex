<script lang="ts" setup>
const loop = ref(0)
const $loop = useTemplateRef("$loop")

const { data: talks } = await useAsyncData(
	"/",
	async () => {
		const all = await queryCollection("talks").order("date", "DESC").all()

		// Group by conference
		const grouped: Record<string, {
			title: string
			links: { name: string, url: string }[]
		}> = {}
		for (const talk of all) {
			if (!grouped[talk.title]) {
				grouped[talk.title] = {
					title: talk.title,
					links: [],
				}
			}

			grouped[talk.title]!.links.push({
				name: talk.conference.location,
				url: `/talks/${talk.slug}`,
			})
		}

		return Object.values(grouped)
	},
)

if (!talks.value) {
	throw createError({ status: 500, fatal: true })
}

let observer: IntersectionObserver | undefined
onMounted(() => {
	if (!$loop.value) {
		return
	}

	observer = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				window.scrollTo({ top: entry.boundingClientRect.top * -1 })
				loop.value++
			}
		})
	}, {
		rootMargin: "0px 0px -100% 0px",
		threshold: 0,
	})
	observer.observe($loop.value)

	if (import.meta.env.DEV) {
		window.addEventListener("keydown", (event) => {
			if (event.key === "ArrowRight") {
				loop.value++
			} else if (event.key === "ArrowLeft") {
				loop.value--
			}
		})
	}
})
onUnmounted(() => {
	observer?.disconnect()
})

useSeoMeta({
	title: () => {
		const engineering = "engineering".split("")
		const design = "design".split("")

		const rand = seedrandom("title")

		for (let i = 0; i < loop.value; i++) {
			const a = Math.floor(rand() * engineering.length)
			const b = Math.floor(rand() * engineering.length)
			const c = Math.floor(rand() * design.length)
			const d = Math.floor(rand() * design.length);

			[engineering[a], engineering[b]] = [engineering[b]!, engineering[a]!];
			[design[c], design[d]] = [design[d]!, design[c]!]
		}

		return `lihbr - ${engineering.join("")} & ${design.join("")}`
	},
	titleTemplate: "%s",
	description: "engineering & design from Tokyo - creating art, tools, and memories",
	articleModifiedTime: "2026-05-13",
})
</script>

<template>
	<div class="space-y-[80svh] overflow-hidden">
		<IndexHero />
		<IndexAbout />
		<IndexDefinition />
		<IndexProjects />
		<IndexTalks v-if="talks" :talks="talks" />
		<IndexFooter />
		<div ref="$loop" class="mb-[20svh]">
			<IndexHero sub />
		</div>
	</div>
</template>
