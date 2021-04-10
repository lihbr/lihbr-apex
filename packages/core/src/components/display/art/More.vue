<!-- HEALTH:HIGH art-more -->
<template>
  <aside class="artMore flex flex-col justify-between text-right items-end">
    <rich-text class="col-5:mb-0 underlinedLinks" :content="text" />
    <decorated-link
      class="mt-5 col-5:mt-0 color color--current color--basic"
      href="/art"
      :title="label"
    >
      <arrow-right-svg class="w-inherit h-inherit" aria-hidden="true" />
    </decorated-link>
  </aside>
</template>

<script>
import RichText from "~/components/controls/RichText.vue";
import DecoratedLink from "~/components/controls/DecoratedLink.vue";

import ArrowRightSvg from "~/assets/icons/arrowRight.svg";

export default {
  components: {
    RichText,
    DecoratedLink,

    ArrowRightSvg
  },
  computed: {
    text() {
      return this.$store.state.content.settings.art_partial_cta_text_html;
    },
    label() {
      return this.$store.state.content.settings.art_partial_cta_label;
    }
  }
};
</script>
