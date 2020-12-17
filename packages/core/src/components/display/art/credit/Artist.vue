<!-- HEALTH:HIGH art-credit-artist -->
<template>
  <div class="artCreditArtist">
    <div class="text-slate-50">
      {{ typeText }}
    </div>
    <div class="color color--current color--basic">
      <smart-link
        :class="{ underline: art.credit_artist_link.href }"
        :href="art.credit_artist_link.href"
        blank
      >
        {{ art.credit_artist_name }}
      </smart-link>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    art: {
      type: Object,
      required: true
    }
  },
  computed: {
    typeText() {
      const type = this.art.type.toLowerCase();
      switch (type) {
        case "art":
          return "An art by";
        case "photograph":
          return "A photograph by";
        case "painting":
          return "A painting by";
        case "music video":
          return "A music video by";
        default:
          return `${type} by`;
      }
    }
  }
};
</script>
