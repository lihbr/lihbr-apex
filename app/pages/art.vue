<script lang="ts" setup>
const arts = [
	{
		width: 1280,
		height: 1280,
		alt: "DAISUKERICHARD #1",
		copyright: "DAISUKERICHARD",
		file: "0891b5bd-fff2-4c1e-a238-5c88df2a3afa_art_daisukerichard_1.jpg",
	},
	{
		width: 1280,
		height: 719,
		alt: "Riva di Tures",
		copyright: "Luigi Ghirri",
		file: "0ec5c3cf-980a-411b-bb05-f39a818e565c_art_luigighirri_rivaditures.jpg",
	},
	{
		width: 1280,
		height: 1280,
		alt: "Haruna Kawai #1",
		copyright: "Haruna Kawai",
		file: "f9301d55-6965-4cfa-b417-bfeebebd963d_art_harunakawai_1.jpg",
	},
	{
		width: 1280,
		height: 898,
		alt: "Hisao Kawada #1",
		copyright: "Hisao Kawada",
		file: "7aa8b08b-f6a8-44e6-9bb4-22cd931f55f4_art_hisaokawada_1.jpg",
	},
	{
		width: 1280,
		height: 905,
		alt: "Yu Kushima #1",
		copyright: "Yu Kushima",
		file: "b8d47c42-5e18-4b7c-ba87-71d12b2617f4_art_yukushima_1.jpg",
	},
	{
		width: 1280,
		height: 906,
		alt: "BerryVerrine #1",
		copyright: "BerryVerrine",
		file: "a2f5f93a-aee1-4c8d-8e5c-0e1aa78ea452_art_berryverrine_1.jpg",
	},
	{
		width: 1280,
		height: 720,
		alt: "REALIZE",
		copyright: "LAM",
		file: "0e19d0c5-fb2e-4ad4-bf53-9a662bb0fbb0_art_lam_realize.jpg",
	},
	{
		width: 1280,
		height: 906,
		alt: "PUNCH #1",
		copyright: "PUNCH",
		file: "0e089c20-6d93-416b-9343-6fee3a8a2865_art_punch_1.jpg",
	},
	{
		width: 1280,
		height: 990,
		alt: "Le Clin d'Œil",
		copyright: "René Gruau",
		file: "22f68789-3b46-4e4e-b216-5a7a58aebec7_art_renegruau_leclindoeil.jpg",
	},
	{
		width: 1280,
		height: 928,
		alt: "Oishii Same #1",
		copyright: "Oishii Same",
		file: "f6a6ff1c-0784-4290-b70b-d0b677421250_art_oishiisame_1.jpg",
	},
	{
		width: 1280,
		height: 838,
		alt: "Green Town",
		copyright: "Friedensreich Hundertwasser",
		file: "472a247d-6d0e-46b4-acc5-9f68e40f4dfb_art_friedensreichhundertwasser_greentown.jpg",
	},
	{
		width: 1280,
		height: 640,
		alt: "Un árbol en forma de silla donde la gente se hace ahí para esperar",
		copyright: "Garitma",
		file: "d8ad952b-8417-456f-a86c-d31ba58f7937_art_garitma_unarbolenformadesilladondelagentesehaceahiparaesperar.jpg",
	},
	{
		width: 1280,
		height: 720,
		alt: "Utena",
		copyright: "Reol",
		file: "4d72bd03-8694-452f-9b93-3abbeb17d47f_art_reol_utena.jpg",
	},
	{
		width: 1280,
		height: 914,
		alt: "がおがお",
		copyright: "Hikaruko Komi",
		file: "bd162091-38d1-4672-bc85-708264b5530f_art_hikarukokomi_gaogao.jpg",
	},
	{
		width: 1280,
		height: 1103,
		alt: "Jell-O Peach",
		copyright: "Arnout van Albada",
		file: "b9319ac7-9d10-4efb-85d5-78ab989d2d38_art_arnoutvanalbada_jellopeach.jpg",
	},
	{
		width: 1280,
		height: 833,
		alt: "Wine Bottle",
		copyright: "Dada Rokkakudo",
		file: "3ed60523-feab-4844-9919-b99cfdf374ea_art_dadarokkakudo_winebottle.jpg",
	},
	{
		width: 1280,
		height: 598,
		alt: "Visitor",
		copyright: "Neil Krug",
		file: "a7948743-616d-487d-b5f2-e6a607283229_art_neilkrug_visitor.jpg",
	},
	{
		width: 1280,
		height: 1024,
		alt: "Plantae",
		copyright: "Alina Frieske",
		file: "fc8af49a-eab9-425b-845e-9271371c75d6_art_alinafrieske_plantae.jpg",
	},
	{
		width: 1280,
		height: 816,
		alt: "Battle History",
		copyright: "Akimasa Tokunaga",
		file: "883ea8fe-3a6b-4216-8044-24a3eda5143a_art_akimasatokunaga_battlehistory.png",
	},
	{
		width: 1280,
		height: 1015,
		alt: "Ombrellone Blue",
		copyright: "Maurizio Vago",
		file: "1fd61b37-c55d-4fa5-af46-f4a14baea93d_art_mauriziovago_ombrelloneblue.jpg",
	},
	{
		width: 1280,
		height: 1003,
		alt: "Le Ballon",
		copyright: "Félix Vallotton",
		file: "cf7cbfb0-49e8-44ce-b3e6-3aa63085ca11_art_felixvallotton_leballon.jpg",
	},
	{
		width: 1280,
		height: 1280,
		alt: "Checkered Village",
		copyright: "MrUgleh",
		file: "bf9ff6a0-e419-4161-8fc2-9649c0438ed2_art_mrugleh_checkeredvillage.png",
	},
]

const parts = new Date().toISOString().split(":")
parts.pop()
const rand = seedrandom(`art/${parts.join(":")}`)

const art = ref<typeof arts[number] | undefined>(arts[Math.floor(rand() * arts.length)])

function cycle() {
	art.value = arts[Math.floor(rand() * arts.length)]!
}

onMounted(() => {
	// cycle()
})

useSeoMeta({
	title: "art",
	articleModifiedTime: "2026-05-13",
})
</script>

<template>
	<main class="px-5">
		<figure v-if="art" class="space-y-5 pt-[20svh]" @click="cycle">
			<PrismicFigureImage
				:key="art.file"
				:file="art.file"
				:alt="art.alt"
				:width="art.width"
				:height="art.height"
			/>
			<figcaption class="space-y-2.5 text-center">
				<h1 class="text-h3 italic lowercase">
					{{ art.copyright }}
				</h1>
				<p class="text-p italic">
					you lost yourself, <NuxtLink href="/" class="underline">../</NuxtLink>
				</p>
			</figcaption>
		</figure>
	</main>
</template>
