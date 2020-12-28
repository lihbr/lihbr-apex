<!-- HEALTH:HIGH header-links -->
<template>
  <nav class="headerLinks">
    <ul class="-mx-3 flex flex-wrap justify-end text-right">
      <li v-for="(item, index) in header_links" :key="`${item.title}-${index}`">
        <smart-link
          :href="item.link.href"
          :blank="item.link.blank"
          class="px-3 py-1 text-s color color--current color--text opacity-80"
        >
          {{ item.title }}
        </smart-link>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  computed: {
    header_links() {
      return this.$store.state.content.settings.header_links;
    }
  }
};
</script>

<style lang="sass" scoped>
.headerLinks
  .smartLink
    transition-property: color, opacity
    will-change: opacity

    &.nuxt-link-exact-active
      @apply cursor-default

    &:not(.nuxt-link-exact-active):not([data-focus-visible-added]):not(:hover)
      @apply text-slate #{!important}

    &.nuxt-link-exact-active, &:focus[data-focus-visible-added], &:hover
      @apply opacity-100
</style>
