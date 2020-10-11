<!-- HEALTH:HIGH aspect-ratio -->
<template>
  <component
    :is="tag"
    class="aspectRatio"
    :class="{
      relative: !absolute && !fixed,
      absolute,
      fixed
    }"
  >
    <div class="h-full w-full absolute">
      <slot />
    </div>
  </component>
</template>

<script>
export default {
  props: {
    tag: {
      type: String,
      default: "div"
    },
    absolute: {
      type: Boolean,
      default: false
    },
    fixed: {
      type: Boolean,
      default: false
    }
  }
};
</script>
