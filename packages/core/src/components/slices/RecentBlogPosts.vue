<!-- HEALTH:HIGH recent-blog-posts -->
<template>
  <block class="recentBlogPosts bg-cream dark:bg-slate" as="section">
    <container>
      <header
        class="max-w-col-6 mx-auto flex justify-between items-center mb-12 col-5:mb-16 color color--current color--basic"
      >
        <h3 class="heading-h2">
          {{ $store.state.content.settings.blog_recent_posts_section_title }}
        </h3>
        <decorated-link href="/blog" title="See all posts">
          <arrow-right-svg class="w-inherit h-inherit" aria-hidden="true" />
        </decorated-link>
      </header>
      <ul class="max-w-col-6 mx-auto stack-10">
        <li v-for="post in slice.primary.featured" :key="post.id">
          <blog-post-thumbnail :post="post" />
        </li>
      </ul>
    </container>
  </block>
</template>

<script>
import DecoratedLink from "~/components/controls/DecoratedLink.vue";
import BlogPostThumbnail from "~/components/display/blog/post/Thumbnail.vue";

import ArrowRightSvg from "~/assets/icons/arrowRight.svg";

export default {
  components: {
    DecoratedLink,
    BlogPostThumbnail,

    ArrowRightSvg
  },
  props: {
    slice: {
      type: Object,
      required: true
    }
  }
};
</script>
