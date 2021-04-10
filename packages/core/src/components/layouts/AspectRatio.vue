<!-- HEALTH:HIGH aspect-ratio -->
<template>
  <component
    :is="as"
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
    as: {
      type: String,
      required: false,
      default: "div"
    },
    absolute: {
      type: Boolean,
      required: false,
      default: false
    },
    fixed: {
      type: Boolean,
      required: false,
      default: false
    }
  }
};
</script>
