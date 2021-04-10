<!-- HEALTH:HIGH art-card-layout -->
<template>
  <div class="artCardLayout" :class="{ 'col-7:flex': !large }">
    <div
      class="frame"
      :class="{
        'mb-5 col-7:mb-0 col-7:flex-1': !large,
        'mb-5 col-5:mb-12': large
      }"
    >
      <slot name="frame" />
    </div>
    <div
      class="aside"
      :class="{
        'col-7:pl-5 col-7:w-30p': !large,
        'col-7:transition-width': !large && expandable,
        'col-7:w-45p': !large && expanded
      }"
    >
      <slot name="aside" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    large: {
      type: Boolean,
      required: false,
      default: false
    },
    expandable: {
      type: Boolean,
      required: false,
      default: false
    },
    expanded: {
      type: Boolean,
      required: false,
      default: false
    }
  }
};
</script>
