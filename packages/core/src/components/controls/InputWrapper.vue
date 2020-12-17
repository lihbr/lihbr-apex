<template>
  <div class="inputWrapper">
    <slot />
  </div>
</template>

<style lang="sass" scoped>
.inputWrapper
  label, input, textarea, select
    @apply block

  input, textarea, select
    font-weight: inherit
    font-style: inherit

  input, textarea, select
    @apply opacity-90 transition-opacity duration-base ease-base

    &:-webkit-autofill,
    &:-webkit-autofill:hover,
    &:-webkit-autofill:focus
      box-shadow: 0 0 0px 100px inset theme("colors.cream.900") !important

    &:focus
      @apply outline-none opacity-100

    &:disabled
      @apply bg-transparent

    &:required
      @apply shadow-none
</style>
