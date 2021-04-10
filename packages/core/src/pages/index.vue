<!-- HEALTH:HIGH __page__home -->
<template>
  <page-builder class="__page__home" :slices="data.slices">
    <block class="content bg-cream dark:bg-slate" as="main">
      <container>
        <home-feed
          :posts="data.blogPosts"
          class="-mx-5 col-5:mx-0 mb-24 col-5:mb-0"
        />
        <common-link-emphasis
          href="/blog"
          :title="data.blog_cta_title"
          :description="data.blog_cta_description"
        />
      </container>
    </block>
  </page-builder>
</template>

<script>
import PageBuilder from "~/components/controls/PageBuilder.vue";

import HomeFeed from "~/components/sections/home/Feed.vue";
import CommonLinkEmphasis from "~/components/display/common/LinkEmphasis.vue";

export default {
  components: {
    PageBuilder,

    HomeFeed,
    CommonLinkEmphasis
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
