<script lang="ts" setup>
const route = useRoute()
const { data: talk } = await useAsyncData(
	route.path,
	() => {
		return queryCollection("talks")
			.where("slug", "=", `${route.params.conference}/${route.params.talk}`)
			.first()
	},
)

if (!talk.value) {
	throw createError({ status: 404, fatal: true })
}

useSeoMeta({
	title: () => route.path.split("/").pop()?.replaceAll("-", " ").toLowerCase(),
	articleModifiedTime: () => talk.value?.date,
})
</script>

<template>
	<div v-if="talk" class="p-5 min-h-svh flex items-center justify-center">
		<main class="text-p w-narrow space-y-[1.25em] lowercase">
			<NuxtLink href="/#talks" class="inline-block underline">
				../
			</NuxtLink>
			<h1>{{ talk.title }}</h1>
			<p>{{ talk.conference.name }}</p>
			<nav>
				<ul>
					<li v-for="link in talk.links" :key="link.url">
						<a :href="link.url" target="_blank" rel="noreferrer" class="underline">
							{{ link.name }}
						</a>
					</li>
				</ul>
			</nav>
		</main>
	</div>
</template>
