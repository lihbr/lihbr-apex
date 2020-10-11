<template>
  <div class="artCredit">
    <art-credit-artist :art="art" class="heading-h3 mb-3" />
    <art-credit-info :art="art" class="text-s col-7:text-m leading-tight" />
  </div>
</template>

<script>
import ArtCreditArtist from "~/components/display/art/credit/Artist.vue";
import ArtCreditInfo from "~/components/display/art/credit/Info.vue";

export default {
  components: {
    ArtCreditArtist,
    ArtCreditInfo
  },
  props: {
    art: {
      type: Object,
      required: true
    }
  }
};
</script>
