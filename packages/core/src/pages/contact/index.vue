<!-- HEALTH:HIGH __page__contact -->
<template>
  <page-builder class="__page__contact" :slices="data.slices">
    <block class="content" as="main">
      <container>
        <contact-form :wording="data.form" />
      </container>
    </block>
  </page-builder>
</template>

<script>
import PageBuilder from "~/components/controls/PageBuilder.vue";

import ContactForm from "~/components/sections/contact/Form.vue";

export default {
  components: {
    PageBuilder,

    ContactForm
  },
  async asyncData(context) {
    if (context.$prismicPreview.hasToken()) {
      return await context.$prismicPreview.get(context.route.path);
    }
    return await context.$pagePayload(context);
  },
  head() {
    const { meta_title, meta_description, meta_image } = this.data;
    return this.$buildHead({
      title: meta_title || "💐",
      description: meta_description,
      metaImage: { og: meta_image.url, tw: meta_image.twitter_variant.url },
      path: this.$route.path
    });
  },
  mounted() {
    this.$store.dispatch("pageChanged");
  }
};
</script>
