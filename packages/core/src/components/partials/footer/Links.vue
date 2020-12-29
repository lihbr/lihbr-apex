<!-- HEALTH:HIGH footer-links -->
<template>
  <div class="footerLinks">
    <ul class="-mx-3">
      <li
        v-for="(item, index) in footer_links"
        :key="`${item.title}-${index}`"
        class="inline-block"
      >
        <smart-link
          :href="item.link.href"
          :blank="item.link.blank"
          class="px-3 py-1 text-s transition-opacity opacity-100"
        >
          {{ item.title }}
        </smart-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  computed: {
    footer_links() {
      return this.$store.state.content.settings.footer_links;
    }
  }
};
</script>

<style lang="sass" scoped>
.footerLinks
  .smartLink
    &.nuxt-link-exact-active
      @apply cursor-default

    &.nuxt-link-exact-active, &:focus[data-focus-visible-added], &:hover
      @apply opacity-50
</style>
