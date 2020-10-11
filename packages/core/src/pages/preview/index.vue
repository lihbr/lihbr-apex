<!-- HEALTH:HIGH __page__preview -->
<template>
  <div class="__page__preview">
    <screen
      class="content color color--current color--basic flex items-center justify-center"
    >
      <common-context-information title="⚆_⚆" message="Loading preview..." />
    </screen>
  </div>
</template>

<script>
import CommonContextInformation from "~/components/display/common/ContextInformation.vue";

export default {
  components: {
    CommonContextInformation
  },
  head() {
    return this.$buildHead({
      title: "Loading preview" || "💐",
      path: this.$route.path
    });
  },
  mounted() {
    this.$store.dispatch("pageChanged");
    this.$prismicPreview.resolve();
  }
};
</script>
