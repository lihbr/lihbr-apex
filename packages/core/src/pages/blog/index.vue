<!-- HEALTH:HIGH __page__blog -->
<template>
  <page-builder class="__page__blog" :slices="data.slices">
    <block class="content bg-cream dark:bg-slate" as="main">
      <container>
        <blog-archive-list
          :sorted-order="data.sortedOrder"
          :sorted-blog-posts="data.sortedBlogPosts"
        />
      </container>
    </block>
  </page-builder>
</template>

<script>
import PageBuilder from "~/components/controls/PageBuilder.vue";

import BlogArchiveList from "~/components/sections/blog/ArchiveList.vue";

export default {
  components: {
    PageBuilder,

    BlogArchiveList
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
