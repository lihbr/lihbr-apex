<!-- HEALTH:HIGH common-link-emphasis-->
<template>
  <div class="linkEmphasis text-center">
    <decorated-link
      class="inline-block color color--current color--basic"
      :blank="blank"
      :href="href"
      :title="title"
      :description="description"
      large
    >
      <arrow-right-svg class="w-inherit h-inherit" aria-hidden="true" />
    </decorated-link>
  </div>
</template>

<script>
import DecoratedLink from "~/components/controls/DecoratedLink.vue";

import ArrowRightSvg from "~/assets/icons/arrowRight.svg";

export default {
  components: {
    DecoratedLink,

    ArrowRightSvg
  },
  props: {
    href: {
      type: String,
      required: false,
      default: ""
    },
    title: {
      type: String,
      required: false,
      default: ""
    },
    blank: {
      type: Boolean,
      required: false,
      default: false
    },
    description: {
      type: String,
      required: false,
      default: ""
    }
  }
};
</script>
