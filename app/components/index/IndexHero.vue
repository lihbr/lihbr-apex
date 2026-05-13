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
	</main>
</template>
