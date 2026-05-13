<script lang="ts" setup>
if (import.meta.server) {
	useSeoMeta({
		...defaultSeoMeta,
		title: "contact",
		articleModifiedTime: "2026-05-13",
	})
}
</script>

<template>
	<main class="min-h-svh flex flex-col justify-center items-center">
		<h1>
			<a href="mailto:mail@lihbr.com" target="_blank" rel="noreferrer" class="underline leading-tight font-20 text-[14svw]" title="Write an email to lihbr">mail@lihbr.com</a><br>
			<NuxtLink href="/" class="underline text-p">
				../
			</NuxtLink>
		</h1>
	</main>
</template>
