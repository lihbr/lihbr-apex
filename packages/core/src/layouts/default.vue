<!-- HEALTH:HIGH __layout__default -->
<template>
  <div class="__layout__default">
    <site-header class="fixed top-0 left-0 z-10 w-screen" />
    <main id="main" class="main">
      <nuxt />
    </main>
    <site-footer />
  </div>
</template>

<script>
import SiteHeader from "~/components/partials/header/Header.vue";
import SiteFooter from "~/components/partials/footer/Footer.vue";

export default {
  components: {
    SiteHeader,
    SiteFooter
  },
  head() {
    const script = [];

    // Add Prismic preview script only if needed
    if (this.$prismicPreview.needScript()) {
      script.push(this.$prismicPreview.getScript());
    }

    return {
      htmlAttrs: {
        class: this.getHtmlClass().join(" ")
      },
      script
    };
  },
  computed: {
    theme() {
      return this.$store.state.theme;
    }
  },
  mounted() {
    this.$store.dispatch("init");

    // Force add classes once
    document.documentElement.classList.add(...this.getHtmlClass());
  },
  methods: {
    getHtmlClass() {
      const htmlClass = [];

      if (this.theme.current) {
        htmlClass.push(
          `is${
            this.theme.current[0].toUpperCase() + this.theme.current.slice(1)
          }`
        );
      }

      return htmlClass;
    }
  }
};
</script>

<style lang="sass">
@import "~/assets/sass/core.sass"

html
  font-size: 16px // don't change this!
  word-spacing: 1px
  -ms-text-size-adjust: 100%
  -webkit-text-size-adjust: 100%
  margin-right: calc(100% - 100vw)
  +themify()
  @apply antialiased box-border font-main font-light text-slate bg-cream-900 overflow-x-hidden

  &.isNavy
    +themifyColor(navy, cream)

  &.isBeet
    +themifyColor(beet, cream)

  &.isFlamingo
    +themifyColor(flamingo, cream)

  &.isOchre
    +themifyColor(ochre, cream)

  &.isButter
    +themifyColor(butter, cream)

  &.isMantis
    +themifyColor(mantis, cream)

body
  @apply w-full overflow-x-auto
</style>
