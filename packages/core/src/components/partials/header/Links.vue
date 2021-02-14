<!-- HEALTH:HIGH header-links -->
<template>
  <nav class="headerLinks">
    <ul
      class="-mx-3 flex flex-wrap justify-end text-right color color--current color--text"
    >
      <li v-for="(item, index) in header_links" :key="`${item.title}-${index}`">
        <smart-link
          :href="item.link.href"
          :blank="item.link.blank"
          class="inline-block px-3 py-1 text-s"
        >
          {{ item.title }}
        </smart-link>
      </li>
      <li class="leading-none">
        <button
          aria-label="Color Mode Switch"
          class="px-3 h-full w-11 fill-current"
          @click="switchTheme"
        >
          <client-only>
            <sun-svg v-if="$colorMode.value === 'light'" class="h-5 w-5" />
            <moon-svg v-else class="h-5 w-5" />
          </client-only>
        </button>
      </li>
    </ul>
  </nav>
</template>

<script>
import SunSvg from "~/assets/icons/sun.svg";
import MoonSvg from "~/assets/icons/moon.svg";

export default {
  components: {
    SunSvg,
    MoonSvg
  },
  computed: {
    header_links() {
      return this.$store.state.content.settings.header_links;
    }
  },
  methods: {
    switchTheme() {
      this.$colorMode.preference =
        this.$colorMode.value === "dark" ? "light" : "dark";
    }
  }
};
</script>

<style lang="sass" scoped>
.headerLinks
  .smartLink, button
    @apply opacity-80
    transition-property: color, opacity
    transition-duration: theme("transitionDuration.DEFAULT")
    transition-timing-function: theme("transitionTimingFunction.DEFAULT")
    will-change: opacity

    &.nuxt-link-exact-active
      @apply cursor-default

    &:not(.nuxt-link-exact-active):not([data-focus-visible-added]):not(:hover)
      @apply text-slate #{!important}

    &.nuxt-link-exact-active, &:focus[data-focus-visible-added], &:hover
      @apply opacity-100

  button:focus
    outline: 2px dashed
    outline-offset: 2px

  button:focus:not([data-focus-visible-added])
    @apply outline-none

html.dark .headerLinks
  .smartLink, button
    &:not(.nuxt-link-exact-active):not([data-focus-visible-added]):not(:hover)
      @apply text-cream #{!important}
</style>
