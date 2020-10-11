<!-- HEALTH:HIGH block -->
<template>
  <component :is="tag" class="block" :class="className">
    <slot />
  </component>
</template>

<script>
export default {
  props: {
    tag: {
      type: String,
      default: "div"
    },
    leading: {
      type: Boolean,
      default: false
    },
    trailing: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    className() {
      if (this.leading) {
        return "pt-24 col-5:pt-32";
      } else if (this.trailing) {
        return "pb-24 col-5:pb-32";
      } else {
        return "py-24 col-5:py-32";
      }
    }
  }
};
</script>
