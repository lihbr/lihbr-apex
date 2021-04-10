<!-- HEALTH:HIGH footer-about -->
<template>
  <rich-text
    class="footerAbout paragraph-lead"
    :content="settings.footer_main_text_html"
  />
</template>

<script>
import RichText from "~/components/controls/RichText.vue";

export default {
  components: {
    RichText
  },
  computed: {
    settings() {
      return this.$store.state.content.settings;
    }
  }
};
</script>
