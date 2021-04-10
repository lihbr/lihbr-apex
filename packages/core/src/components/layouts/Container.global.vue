<!-- HEALTH:HIGH container -->
<template>
  <component :is="as" class="container px-5 mx-auto" :class="widthClass">
    <slot />
  </component>
</template>

<script>
export default {
  props: {
    widthClass: {
      type: String,
      required: false,
      default: "col-10:max-w-col-10"
    },
    as: {
      type: String,
      required: false,
      default: "div"
    }
  }
};
</script>
