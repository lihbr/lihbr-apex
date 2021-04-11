<!-- HEALTH:HIGH header -->
<template>
  <header
    id="header"
    class="header transition-opacity-transform"
    :class="{ isSmall, isHidden }"
  >
    <container
      class="flex justify-between items-center transition-height relative z-10"
      :class="isSmall ? 'h-16' : 'h-24 col-5:h-32'"
    >
      <smart-link
        class="logo color color--current color--basic select-none self-center"
        href="/"
        title="Home"
      >
        <logo-svg
          class="logoSvg inline-block fill-current transition-width-height"
          aria-hidden="true"
        />
      </smart-link>
      <header-links class="pl-12" />
    </container>
    <background-svg
      class="backgroundSvg w-full absolute top-0 left-0 pointer-events-none text-cream-900 dark:text-slate-900 fill-current transition-height-opacity"
      :class="isSmall ? 'h-16 opacity-100' : 'h-24 col-5:h-32 opacity-0'"
    />
    <gradient-svg
      class="gradientSvg w-full h-24 col-5:h-32 -mt-px col-5:mt-0 pointer-events-none text-cream-900 dark:text-slate-900 fill-current transition-opacity"
      :class="isSmall ? 'opacity-100' : 'opacity-0'"
    />
  </header>
</template>

<script>
import throttle from "lodash/throttle";

import HeaderLinks from "~/components/partials/header/Links.vue";

import LogoSvg from "~/assets/icons/logo.svg";

import GradientSvg from "~/assets/img/gradient.svg";
import BackgroundSvg from "~/assets/img/background.svg";

export default {
  components: {
    HeaderLinks,

    LogoSvg,

    GradientSvg,
    BackgroundSvg
  },
  data() {
    return {
      scrollPosition: 0,
      scrollingDown: false,
      smallThreshold: 96
    };
  },
  computed: {
    isHidden() {
      return this.scrollingDown && this.scrollPosition > 20;
    },
    isSmall() {
      return this.scrollPosition > this.smallThreshold;
    }
  },
  mounted() {
    this.scroll();
    this.resize();

    this.$options._scrollEvent = throttle(this.scroll.bind(this), 100);
    window.addEventListener("scroll", this.$options._scrollEvent);

    this.$options._resizeEvent = throttle(this.resize.bind(this), 200);
    window.addEventListener("resize", this.$options._resizeEvent);
  },
  destroyed() {
    window.removeEventListener("scroll", this.$options._scrollEvent);
    window.removeEventListener("resize", this.$options._resizeEvent);
  },
  methods: {
    scroll() {
      const scrollY = window.pageYOffset;
      this.scrollingDown = this.scrollPosition < scrollY;
      this.scrollPosition = scrollY;
    },
    resize() {
      this.smallThreshold = window.innerWidth > 600 ? 128 : 96;
    }
  }
};
</script>

<style lang="sass" scoped>
.header
  will-change: opacity, transform

  .logo
    &.nuxt-link-exact-active
      @apply cursor-default

  .logoSvg
    height: 2.25rem
    width: 74px

    @screen col-5
      height: 2.75rem
      width: 90px

  .backgroundSvg, .gradientSvg
    will-change: opacity

  &.isSmall
    @apply opacity-100

    .logoSvg
      height: 2.25rem
      width: 74px

  &.isHidden
    transform: translateY(-100%)
    @apply opacity-50
</style>
