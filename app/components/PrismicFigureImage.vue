<script lang="ts" setup>
defineProps<{
	file: string
	width: string | number
	height: string | number
}>()
</script>

<template>
	<img
		:src="`https://images.prismic.io/lihbr/${file}?auto=format`"
		:srcset="`https://images.prismic.io/lihbr/${file}?auto=format&width=560 560w, https://images.prismic.io/lihbr/${file}?auto=format&width=820 820w, https://images.prismic.io/lihbr/${file}?auto=format&width=1080 1080w`"
		:width="width"
		:height="height"
		class="max-h-[60svh] h-auto mx-auto"
		:style="{ width: `min(${width}px, 100%, calc(60svh * ${width} / ${height}))` }"
	>
</template>
