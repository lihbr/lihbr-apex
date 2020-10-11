<!-- HEALTH:HIGH art-picture -->
<template>
  <figure class="artPicture overflow-hidden">
    <img
      ref="img"
      :src="art.picture.url"
      :alt="art.picture.alt"
      :style="artStyle"
      class="w-full h-full transition-bg duration-base ease-base"
      :class="maxHClass"
      loading="lazy"
    />
  </figure>
</template>

<script>
export default {
  props: {
    art: {
      type: Object,
      required: true
    },
    maxHClass: {
      type: String,
      default: "max-h-80-vh"
    }
  },
  computed: {
    artStyle() {
      const {
        fitting_object_fit,
        fitting_object_position,
        background_color
      } = this.art;

      return {
        objectFit: `${fitting_object_fit}`.toLowerCase(),
        objectPosition: `${fitting_object_position.replace(
          /-/g,
          " "
        )}`.toLowerCase(),
        fontFamily: `"object-fit: ${fitting_object_fit}; object-position: ${fitting_object_position.replace(
          /-/g,
          " "
        )}"`.toLowerCase(),
        backgroundColor: background_color
      };
    }
  }
};
</script>
