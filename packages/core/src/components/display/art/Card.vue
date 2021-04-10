<!-- HEALTH:HIGH art-card -->
<template>
  <art-card-layout class="artCard">
    <template #frame>
      <art-picture max-h-class="max-h-col-4" :art="art" />
    </template>
    <template #aside>
      <art-credit
        class="col-7:h-full col-7:flex col-7:flex-col col-7:justify-between"
        :art="art"
      />
    </template>
  </art-card-layout>
</template>

<script>
import ArtCardLayout from "~/components/display/art/CardLayout.vue";
import ArtPicture from "~/components/display/art/Picture.vue";
import ArtCredit from "~/components/display/art/credit/Credit.vue";

export default {
  components: {
    ArtCardLayout,
    ArtPicture,
    ArtCredit
  },
  props: {
    art: {
      type: Object,
      required: true
    }
  }
};
</script>
