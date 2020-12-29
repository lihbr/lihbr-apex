<!-- HEALTH:HIGH footer-footnote -->
<template>
  <div class="footerFootnote">
    <container>
      <div class="flex justify-between py-5 text-s">
        <div>
          © {{ new Date().getFullYear() }} {{ settings.site_title }} — ref:
          <smart-link
            :href="commitUrl"
            blank
            title="Check out this build commit"
          >
            {{ commitRef.slice(0, 7) }}
          </smart-link>
        </div>
        <smart-link
          :href="settings.footer_footnote_link.href"
          :blank="settings.footer_footnote_link.blank"
        >
          {{ settings.footer_footnote_link_title }}
        </smart-link>
      </div>
    </container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      commitRef: process.env.COMMIT_REF,
      repositoryUrl: process.env.REPOSITORY_URL
    };
  },
  computed: {
    settings() {
      return this.$store.state.content.settings;
    },
    commitUrl() {
      if (this.repositoryUrl && this.repositoryUrl !== "unknown") {
        if (this.commitRef && this.commitRef !== "unknown") {
          return `${this.repositoryUrl}/commit/${this.commitRef}`;
        } else {
          return this.repositoryUrl;
        }
      } else {
        return "";
      }
    }
  }
};
</script>

<style lang="sass" scoped>
.footnote
  .nuxt-link-exact-active
    @apply cursor-default opacity-50
</style>
