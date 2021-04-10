<!-- HEALTH:HIGH art-picture -->
<template>
  <figure class="artPicture overflow-hidden">
    <img
      ref="img"
      :src="art.picture.url"
      :alt="art.picture.alt"
      :style="artStyle"
      class="w-full h-full transition-bg"
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
      required: false,
      default: "max-h-80-vh"
    }
  },
  computed: {
    artStyle() {
      const fitting_object_fit = this.art.fitting_object_fit || "contain";
      const fitting_object_position =
        this.art.fitting_object_position || "center";

      return {
        objectFit: fitting_object_fit.toLowerCase(),
        objectPosition: fitting_object_position
          .replace(/-/g, " ")
          .toLowerCase(),
        backgroundColor: this.art.background_color
      };
    }
  }
};
</script>
