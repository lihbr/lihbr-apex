<!-- HEALTH:UNKNOWN __layout__{{ kebabCase name }} -->
<template>
  <div class="__layout__{{ kebabCase name }}">
    <main id="main" class="main">
      <nuxt />
    </main>
  </div>
</template>

<script>
// import Component from "~/components/Component.vue";

export default {
  components: {
    // Component
  },
  head() {
    const script = [];

    // Add Prismic preview script only if needed
    if (this.$prismicPreview.needScript()) {
      script.push(this.$prismicPreview.getScript());
    }

    return {
      htmlAttrs: {
        "data-theme": this.theme.current
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

  &.dark
    @apply text-cream bg-slate-900

  &[data-theme="navy"]
    +themifyColor(navy, cream)

  &[data-theme="beet"]
    +themifyColor(beet, cream)

  &[data-theme="flamingo"]
    +themifyColor(flamingo, cream)

  &[data-theme="ochre"]
    +themifyColor(ochre, cream)

  &[data-theme="butter"]
    +themifyColor(butter, cream)

  &[data-theme="mantis"]
    +themifyColor(mantis, cream)

body
  @apply w-full overflow-x-auto
</style>
