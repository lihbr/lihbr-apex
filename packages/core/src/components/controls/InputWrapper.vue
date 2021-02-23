<template>
  <div class="inputWrapper">
    <slot />
  </div>
</template>

<style lang="sass" scoped>
.inputWrapper
  input, textarea, select
    @apply opacity-80 transition-opacity

    &:-webkit-autofill,
    &:-webkit-autofill:hover,
    &:-webkit-autofill:focus
      box-shadow: 0 0 0px 100px inset theme("colors.cream.900") !important
      -webkit-text-fill-color: theme("colors.slate.900")

    &:focus
      @apply outline-none opacity-100

    &:disabled
      @apply bg-transparent

    &:required
      @apply shadow-none

html.dark .inputWrapper
  input, textarea, select
    &:-webkit-autofill,
    &:-webkit-autofill:hover,
    &:-webkit-autofill:focus
      box-shadow: 0 0 0px 100px inset theme("colors.slate.900") !important
      -webkit-text-fill-color: theme("colors.cream.900")
</style>
