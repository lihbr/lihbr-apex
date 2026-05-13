<script lang="ts" setup>
const offsets = [
	[-200, -55],
	[-100, -15],
	[0, -105],
	[100, 15],
	[200, -130],
] as const
const texts = [-70, -15, 0, 10, 40, 70, 114, 117, 119, 123, 140, 144, 145, 146, 147, 148, 149, 150, 151, 152, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 175, 180, 185, 186, 188, 189, 192, 210, 216, 219, 250]
</script>

<template>
	<footer id="footer">
		<figure class="space-y-5">
			<div
				class="aspect-2/3 max-h-[60svh] w-auto mx-auto pointer-events-none select-none overflow-hidden"
				inert="true"
			>
				<template v-for="([x, y], o) in offsets" :key="o">
					<div
						v-for="(value, t) in texts"
						:key="t"
						:style="{ translate: `${x}% ${y + value - t * 100 - o * texts.length * 100}%` }"
						class="text-p w-narrow space-y-[1.25em] mx-auto"
					>
						<p>
							<span class="underline">lihbr.com</span> does not use cookies and<br>does not collect any personal data
						</p>
						<p>
							<span class="underline">cc by-nc-nd 4.0</span> © <span class="whitespace-nowrap">2020-2026</span> lihbr
						</p>
					</div>
				</template>
			</div>
			<figcaption class="text-p w-narrow mx-auto space-y-[1.25em]">
				<h2 id="contact" class="sr-only">
					Contact
				</h2>
				<nav class="mb-[3.75em]">
					<ul>
						<li>
							<a href="mailto:mail@lihbr.com" target="_blank" rel="noreferrer" class="underline" title="Write an email to lihbr">mail</a>
						</li>
						<li>
							<a href="https://bsky.app/profile/lihbr.com" target="_blank" rel="noreferrer" class="underline" title="Permalink to lihbr's Bluesky">bluesky</a>
						</li>
						<li>
							<a href="https://x.com/li_br" target="_blank" rel="noreferrer" class="redacted" title="Permalink to lihbr's X">twitter</a>
						</li>
						<li>
							<a href="https://www.instagram.com/lihbr.png" target="_blank" rel="noreferrer" class="underline" title="Permalink to lihbr's Instagram">instagram</a>
						</li>
					</ul>
				</nav>
				<h2 id="terms" class="sr-only">
					Terms
				</h2>
				<p>
					<NuxtLink href="/" class="underline">
						lihbr.com
					</NuxtLink> does not use cookies and<br>does not collect any personal data
				</p>
				<p>
					<a href="https://creativecommons.org/licenses/by-nc-nd/4.0" target="_blank" rel="noreferrer" class="underline">cc by-nc-nd 4.0</a> © <span class="whitespace-nowrap">2020-2026</span> lihbr
				</p>
			</figcaption>
		</figure>
	</footer>
</template>
