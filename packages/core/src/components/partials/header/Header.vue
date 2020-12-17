<!-- HEALTH:HIGH header -->
<template>
  <header
    id="header"
    class="header transition-opacity-transform duration-base ease-base pointer-events-none"
    :class="{ isSmall, isHidden }"
  >
    <div
      class="transition-bg duration-base ease-base pointer-events-auto"
      :class="{ 'bg-cream-900': isSmall }"
    >
      <container>
        <div
          class="flex justify-between items-center transition-height duration-base ease-base"
          :class="isSmall ? 'h-16' : 'h-24 col-5:h-32'"
        >
          <smart-link
            class="logo color color--current color--basic select-none self-center"
            href="/"
            title="Home"
          >
            <logo-svg
              class="logoSvg inline-block fill-current transition-width-height duration-base ease-base"
              aria-hidden="true"
            />
          </smart-link>
          <header-links class="pl-12" />
        </div>
      </container>
    </div>
    <gradient-svg
      class="gradientSvg w-full h-24 col-5:h-32 -mt-1 pointer-events-none text-cream-900 fill-current opacity-0 transition-opacity duration-base ease-base"
    />
  </header>
</template>

<script>
import throttle from "lodash/throttle";

import HeaderLinks from "~/components/partials/header/Links.vue";

import LogoSvg from "~/assets/icons/logo.svg";

import GradientSvg from "~/assets/img/gradient.svg";

export default {
  components: {
    HeaderLinks,

    LogoSvg,

    GradientSvg
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

  .gradientSvg
    will-change: opacity

  &.isSmall
    @apply opacity-100

    .logoSvg
      height: 2.25rem
      width: 74px

    .gradientSvg
      @apply opacity-100

  &.isHidden
    transform: translateY(-100%)
    @apply opacity-50
</style>
