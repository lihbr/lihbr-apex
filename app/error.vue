<script lang="ts" setup>
import type { NuxtError } from "#app"

const props = defineProps<{ error: NuxtError }>()

const route = useRoute()

useSeoMeta({
	title: () => route.path.split("/").pop()?.replaceAll("-", " ").toLowerCase(),
	titleTemplate: "%s %separator %siteName",
})

const texts = computed(() => {
	const rand = seedrandom(`${props.error.status}@${route.path}`)
	return Array.from({ length: 32 }).fill(0).map((_) => rand() * 50)
})
</script>

<template>
	<div class="px-5 pt-5 text-h1 lowercase h-svh flex flex-col">
		<header class="w-narrow mb-[1.25em]">
			<button class="underline cursor-pointer" @click="clearError({ redirect: '/' })">
				~/
			</button>
		</header>
		<h1 class="w-narrow">
			{{ error.status }}
		</h1>
		<div class="flex-1 w-narrow pointer-events-none select-none relative overflow-hidden" inert="true">
			<p
				v-for="(y, index) in texts"
				:key="index"
				:style="{ top: `${y}em` }"
				class="absolute left-0"
			>
				{{ error.status }}
			</p>
		</div>
	</div>
</template>
