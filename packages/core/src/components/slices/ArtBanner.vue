<!-- HEALTH:HIGH art-banner -->
<template>
  <block v-if="art.picture" as="section" class="art-banner">
    <container>
      <art-card-layout large>
        <template #frame>
          <art-picture max-h-class="max-h-80vh" :art="art" />
        </template>
        <template #aside>
          <div class="min-h-32 col-5:flex col-5:justify-between">
            <div class="credit">
              <art-credit-artist
                class="heading-h2 mb-3 col-5:mb-12"
                :art="art"
              />
              <art-credit-info :art="art" class="leading-tight" />
            </div>
            <art-more class="mt-12 col-5:mt-0 col-5:max-w-col-2" />
          </div>
        </template>
      </art-card-layout>
    </container>
  </block>
</template>

<script>
import ArtCardLayout from "~/components/display/art/CardLayout.vue";

import ArtPicture from "~/components/display/art/Picture.vue";

import ArtCreditArtist from "~/components/display/art/credit/Artist.vue";
import ArtCreditInfo from "~/components/display/art/credit/Info.vue";
import ArtMore from "~/components/display/art/More.vue";

export default {
  components: {
    ArtCardLayout,

    ArtPicture,

    ArtCreditArtist,
    ArtCreditInfo,
    ArtMore
  },
  props: {
    slice: {
      type: Object,
      required: true
    }
  },
  computed: {
    art() {
      if (this.slice.primary.featured_art.picture) {
        return this.slice.primary.featured_art;
      } else {
        return this.$store.state.content.currentArt;
      }
    }
  }
};
</script>
