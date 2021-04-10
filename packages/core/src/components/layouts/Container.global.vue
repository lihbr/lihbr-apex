<!-- HEALTH:HIGH container -->
<template>
  <component :is="as" class="container px-5 mx-auto col-10:max-w-col-10">
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
