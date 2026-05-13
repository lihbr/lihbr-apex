<script lang="ts" setup>
const greeting = computed(() => {
	const hours = new Date().getHours()
	switch (true) {
		// case hours <= 0:
		// 	return "hi, github lurker"
		case hours <= 3:
			return "last train gone"
		case hours <= 7:
			return "early bird"
		case hours <= 11:
			return "morning, friend"
		case hours <= 13:
			return "bytes and lunch"
		case hours <= 15:
			return "afternoon, friend"
		case hours <= 17:
			return "tea & lihbr"
		case hours <= 21:
			return "done for the day"
		default:
			return "late, friend"
	}
})

useSeoMeta({
	title: "card",
	articleModifiedTime: "2026-05-13",
})
definePageMeta({ robots: false })
</script>

<template>
	<div class="space-y-[45svh]">
		<main class="px-5">
			<figure class="space-y-5 pt-[20svh]">
				<PrismicFigureImage
					file="aezLusBOoF08xTGh_0006-flamingo.jpg"
					alt="Close-up of overlapping color swatches labeled “flamingo”, showing a red/orange square with the hex code #e84311 and contrast ratio 3.97:1 on white cards."
					width="1080"
					height="1620"
				/>
				<figcaption class="space-y-2.5 text-center">
					<h1 class="text-h3 italic">
						<span class="redacted">business</span> card
					</h1>
					<p class="text-p italic">
						{{ greeting }}
					</p>
				</figcaption>
			</figure>
		</main>
		<section class="container mx-auto px-5 space-y-[1.25em] text-h1 mb-[20svh]">
			<h2 class="sr-only">
				Contact
			</h2>
			<p>
				our paths crossed, let's keep that connection alive where it's convenient for you, <a href="mailto:mail@lihbr.com" target="_blank" rel="noreferrer" class="underline" title="Write an email to lihbr">mail</a>, <a href="https://bsky.app/profile/lihbr.com" target="_blank" rel="noreferrer" class="underline" title="Permalink to lihbr's Bluesky">bluesky</a>, <a href="https://x.com/li_hbr" target="_blank" rel="noreferrer" class="redacted" title="Permalink to lihbr's X">twitter</a>, <a href="https://www.instagram.com/lihbr.png" target="_blank" rel="noreferrer" class="underline" title="Permalink to lihbr's Instagram">instagram</a>
			</p>
			<NuxtLink href="/" class="underline">
				../
			</NuxtLink>
		</section>
	</div>
</template>
