<!-- HEALTH:HIGH link-emphasis -->
<template>
  <block class="linkEmphasis" as="section">
    <container>
      <common-link-emphasis
        :blank="slice.primary.link.blank"
        :href="slice.primary.link.href"
        :title="slice.primary.title"
        :description="slice.primary.description"
      />
    </container>
  </block>
</template>

<script>
import CommonLinkEmphasis from "~/components/display/common/LinkEmphasis.vue";

export default {
  components: {
    CommonLinkEmphasis
  },
  props: {
    slice: {
      type: Object,
      required: true
    }
  }
};
</script>
