<!-- HEALTH:HIGH screen -->
<template>
  <component :is="as" class="screen h-screen">
    <slot />
  </component>
</template>

<script>
export default {
  props: {
    as: {
      type: String,
      required: false,
      default: "div"
    }
  }
};
</script>
