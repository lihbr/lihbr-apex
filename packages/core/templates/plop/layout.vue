<!-- HEALTH:UNKNOWN __layout__{{ kebabCase name }} -->
<template>
  <div class="__layout__{{ kebabCase name }}">
    <main id="main" class="main">
      <nuxt />
    </main>
  </div>
</template>

<script>
import objectFitImages from "object-fit-images";

// import Component from "~/components/Component.vue";

export default {
  components: {
    // Component
  },
  head() {
    return {
      htmlAttrs: {
        class: this.getHtmlClass().join(" ")
      }
    };
  },
  computed: {
    theme() {
      return this.$store.state.theme;
    },
    detect() {
      return this.$store.state.detect;
    }
  },
  mounted() {
    this.$store.dispatch("init");

    /**
     * Default operations
     */
    this.$store.dispatch("detect/detect");
    // Object fit polyfill
    objectFitImages();
    // Force add classes once
    document.documentElement.classList.add(...this.getHtmlClass());
    /**
     * End of default operations
     */
  },
  methods: {
    getHtmlClass() {
      const htmlClass = [];

      if (this.detect.browser) {
        htmlClass.push(this.detect.browser);
      }
      if (this.detect.isMobile) {
        htmlClass.push("isMobile");
      }
      if (this.detect.isTouch) {
        htmlClass.push("isTouch");
      }

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
  -moz-osx-font-smoothing: grayscale
  -webkit-font-smoothing: antialiased
  box-sizing: border-box
  margin-right: calc(100% - 100vw)
  +themify()
  @apply font-main font-light text-slate bg-white overflow-x-hidden

  &.isGreen
    +themifyColor(green, cream)

  &.isOrange
    +themifyColor(orange, cream)

  &.isRed
    +themifyColor(red, cream)

  &.isBeet
    +themifyColor(beet, cream)

  &.isNavy
    +themifyColor(navy, cream)

  &.isYellow
    +themifyColor(yellow, cream)

body
  @apply w-full overflow-x-auto
</style>
