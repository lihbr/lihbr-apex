<!-- HEALTH:HIGH simple-button -->
<template>
  <component
    :is="as"
    class="simpleButton h-8 flex justify-center rounded px-3 border-2 fill-current cursor-pointer select-none font-bold text-s transition-bg-opacity"
    :class="{ disabled }"
    :disabled="as === 'button' && disabled"
    :aria-disabled="as !== 'button' && disabled"
  >
    <span class="wrapper self-stretch flex items-center">
      <slot />
    </span>
  </component>
</template>

<script>
export default {
  props: {
    as: {
      type: String,
      required: false,
      default: "button"
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    }
  }
};
</script>

<style lang="sass" scoped>
.simpleButton
  &:not(:hover):not(:focus)
    @apply bg-transparent #{!important}

  &:hover, &:focus
    @apply duration-1/2 outline-none

    .wrapper
      @apply text-cream transition-color duration-1/2

  &.disabled
    @apply pointer-events-none opacity-50

html.dark .simpleButton
  &:hover, &:focus
    .wrapper
      @apply text-slate
</style>
