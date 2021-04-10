<!-- HEALTH:HIGH __page__blog-post -->
<template>
  <page-builder class="__page__blog-post" :slices="data.slices">
    <block class="content" trailing as="main">
      <container>
        <blog-post-hero :data="data" />
        <blog-post-content :content="data.body_html" class="pb-12" />
        <blog-post-share :data="data" class="max-w-col-6 mx-auto" />
      </container>
    </block>
  </page-builder>
</template>

<script>
import PageBuilder from "~/components/controls/PageBuilder.vue";

import BlogPostHero from "~/components/sections/blog/post/Hero.vue";
import BlogPostContent from "~/components/sections/blog/post/Content.vue";
import BlogPostShare from "~/components/sections/blog/post/Share.vue";

export default {
  components: {
    PageBuilder,

    BlogPostHero,
    BlogPostContent,
    BlogPostShare
  },
  async asyncData(context) {
    if (context.$prismicPreview.hasToken()) {
      return await context.$prismicPreview.get(context.route.path);
    }
    return await context.$pagePayload(context);
  },
  head() {
    const {
      title,
      lead_text,
      published_date,

      meta_title,
      meta_description,
      meta_image
    } = this.data;
    const path = this.$route.path;

    const structuredData = [
      {
        "@context": "http://schema.org",
        "@type": "BlogPosting",

        mainEntityOfPage: {
          "@type": "WebSite",
          "@id": process.env.APP_URL
        },

        url: `${process.env.APP_URL}${path ? path : ""}`.replace(/\/$/, ""),
        name: title,
        alternateName: process.env.APP_NAME,
        headline: title,
        image:
          meta_image && meta_image.url
            ? meta_image.url
            : process.env.APP_METAIMG_OG,
        description: lead_text,
        datePublished: published_date,
        dateModified: published_date,

        author: {
          "@type": "Person",
          name: this.$store.state.content.settings.site_main_author
        },

        publisher: {
          "@type": "Organization",
          url: process.env.APP_URL,
          logo: {
            "@type": "ImageObject",
            url: process.env.APP_METAIMG_OG
          },
          name: process.env.APP_NAME
        }
      }
    ];

    return this.$buildHead({
      title: meta_title || "💐",
      description: meta_description,
      metaImage: { og: meta_image.url, tw: meta_image.twitter_variant.url },
      path: this.$route.path,
      additionalStructuredData: structuredData
    });
  },
  mounted() {
    if (this.data.color) {
      this.$store.dispatch("pageChanged", ["theme"]);
      this.$store.commit("theme/change", this.data.color.toLowerCase());
    } else {
      this.$store.dispatch("pageChanged");
    }
  }
};
</script>
