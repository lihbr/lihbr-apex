<!-- HEALTH:HIGH art-card-layout -->
<template>
  <div
    class="artCardLayout"
    :class="{ regular: !large, large, expandable, expanded }"
  >
    <div class="frame">
      <slot name="frame" />
    </div>
    <aside class="aside">
      <slot name="aside" />
    </aside>
  </div>
</template>

<script>
export default {
  props: {
    large: {
      type: Boolean,
      default: false
    },
    expandable: {
      type: Boolean,
      default: false
    },
    expanded: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="sass" scoped>
.artCardLayout
  &.regular
    @screen col-7
      @apply flex

    .frame
      @apply mb-5

      @screen col-7
        @apply mb-0 flex-1

    .aside
      @screen col-7
        @apply pl-5 w-30p

    &.expandable
      .aside
        @screen col-7
          @apply transition-width

    &.expanded
      .aside
        @screen col-7
          @apply w-45p

  &.large
    .frame
      @apply mb-5

      @screen col-5
        @apply mb-12
</style>
