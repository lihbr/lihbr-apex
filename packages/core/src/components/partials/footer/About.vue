<!-- HEALTH:HIGH footer-about -->
<template>
  <div class="footerAbout">
    <rich-text
      class="paragraph-lead"
      :content="settings.footer_main_text_html"
    />
  </div>
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
