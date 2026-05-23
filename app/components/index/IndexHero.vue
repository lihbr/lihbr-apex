<script lang="ts" setup>
defineProps<{ sub?: boolean }>()
</script>

<template>
	<main class="px-5">
		<figure class="text-center space-y-5 pt-[20svh]">
			<div class="relative">
				<PrismicFigureImage
					file="aeIme51ZCF7ETS5I_voigtlander.jpg"
					alt="Voigtlander Vito film camera with red tape attached, connected by a cable to a compact Voigtlander flash unit on a light background."
					fetchpriority="high"
					width="1080"
					height="1620"
				/>
				<IconLihbr class="absolute-center text-flamingo mix-blend-multiply h-5/13" />
			</div>
			<figcaption class="space-y-2.5">
				<Component :is="sub ? 'h2' : 'h1'" class="text-h3 italic">
					lihbr
				</Component>
				<p class="text-p italic">
					engineering — design
				</p>
			</figcaption>
		</figure>
		<a
			class="absolute z-1 top-5 lg:top-auto lg:bottom-5 right-5 max-w-[min(calc(100svw-2.5rem),20svh)] lg:max-w-[min(calc(100svw-2.5rem),30svh)] w-full after:content-[''] after:block after:absolute after:inset-0 after:bg-flamingo after:mix-blend-screen"
			href="https://vwfndr.camera/mbl"
		>
			<video
				src="https://lihbr.cdn.prismic.io/lihbr/ahAcZbK9tuLqEEZd_vwfndr-mbl.mp4"
				autoplay
				muted
				loop
				playsinline
				class="w-full aspect-4/5"
			/>
			<p class="absolute inset-0 z-1 flex flex-col items-center justify-center text-h3 lowercase text-center">
				VWFNDR MBL<br>
				<span class="underline">out now</span>
			</p>
		</a>
	</main>
</template>
