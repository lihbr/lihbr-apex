<!-- HEALTH:HIGH decorated-link -->
<template>
  <div class="decoratedLink">
    <smart-link
      class="block relative"
      :class="{ 'pt-1': !large, 'pt-3': large }"
      :href="href"
      :title="title"
      :blank="blank"
      :rel="rel"
    >
      <div
        class="title font-bold flex justify-between items-center"
        :class="{
          'text-m': !large,
          'text-xl': large
        }"
      >
        {{ title }}
        <div class="ml-3 fill-current h-5 w-5">
          <slot />
        </div>
      </div>
      <p
        v-if="large && description"
        class="description italic text-left text-m"
      >
        {{ description }}
      </p>
    </smart-link>
  </div>
</template>

<script>
export default {
  props: {
    href: {
      type: String,
      required: false,
      default: ""
    },
    rel: {
      type: String,
      required: false,
      default: null
    },
    title: {
      type: String,
      required: false,
      default: ""
    },
    blank: {
      type: Boolean,
      required: false,
      default: false
    },
    description: {
      type: String,
      required: false,
      default: ""
    },
    large: {
      type: Boolean,
      required: false,
      default: false
    }
  }
};
</script>

<style lang="sass" scoped>
.decoratedLink
  .smartLink
    &::before
      content: ""
      transform-origin: 100% 50%
      transform: translateX(-25%) scaleX(0.75)
      will-change: transform
      @apply block absolute pointer-events-none border-t-2 w-full left-0 top-0 transition-transform

    &:focus[data-focus-visible-added], &:hover
      &::before
        transform: translateX(0) scaleX(0)
</style>
