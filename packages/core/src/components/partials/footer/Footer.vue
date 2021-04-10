<!-- HEALTH:HIGH footer -->
<template>
  <footer id="footer" class="footer bg-slate text-cream">
    <block>
      <container>
        <div class="col-6:flex col-6:justify-between">
          <footer-about class="max-w-col-4 mb-12 col-6:mb-0" />
          <footer-links class="col-6:ml-12 col-6:flex-shrink-0" />
        </div>
        <footer-socials class="mt-16" />
      </container>
    </block>
    <footer-footnote />
  </footer>
</template>

<script>
import FooterAbout from "~/components/partials/footer/About.vue";
import FooterLinks from "~/components/partials/footer/Links.vue";
import FooterSocials from "~/components/partials/footer/Socials.vue";
import FooterFootnote from "~/components/partials/footer/Footnote.vue";

export default {
  components: {
    FooterAbout,
    FooterLinks,
    FooterSocials,
    FooterFootnote
  },
  computed: {
    settings() {
      return this.$store.state.content.settings;
    }
  }
};
</script>
