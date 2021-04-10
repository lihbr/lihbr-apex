<!-- HEALTH:HIGH art-card-list -->
<template>
  <div class="artCardList">
    <ul class="-mt-5 -mb-12 col-5:-mb-5">
      <li
        v-for="(art, index) in arts"
        :key="`${art._ctx.id}-${index}`"
        class="pt-5 pb-12 col-7:pb-5"
      >
        <art-card :art="art" />
      </li>
    </ul>
  </div>
</template>

<script>
import ArtCard from "~/components/display/art/Card.vue";

export default {
  components: {
    ArtCard
  },
  props: {
    arts: {
      type: Array,
      required: false,
      default: () => []
    }
  }
};
</script>
