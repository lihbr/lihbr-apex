<script lang="ts" setup>
defineProps<{
	talks: {
		title: string
		links: {
			name: string
			url: string
		}[]
	}[]
}>()
</script>

<template>
	<section id="talks" class="container mx-auto px-5 text-h3 space-y-[1.25em] lowercase">
		<h2 class="sr-only">
			Talks
		</h2>
		<p v-for="talk in talks" :key="talk.title" class="w-narrow">
			{{ talk.title }}<br>
			<template v-for="(link, index) in talk.links" :key="link.url">
				<NuxtLink :href="link.url" class="underline">
					{{ link.name }}
				</NuxtLink>
				<br v-if="index !== talk.links.length - 1">
			</template>
		</p>
	</section>
</template>
