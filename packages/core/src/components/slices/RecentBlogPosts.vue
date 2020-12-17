<!-- HEALTH:HIGH recent-blog-posts -->
<template>
  <div class="recentBlogPosts">
    <block class="bg-cream">
      <container>
        <div class="max-w-col-6 mx-auto">
          <div
            class="flex justify-between items-center mb-12 col-5:mb-16 color color--current color--basic"
          >
            <h3 class="heading-h2">
              {{
                $store.state.content.settings.blog_recent_posts_section_title
              }}
            </h3>
            <decorated-link href="/blog" title="See all posts">
              <arrow-right-svg class="w-inherit h-inherit" aria-hidden="true" />
            </decorated-link>
          </div>
          <ul class="stack-10">
            <li
              v-for="(post, index) in slice.primary.featured"
              :key="`${post.href}-${index}`"
            >
              <blog-post-thumbnail :post="post" />
            </li>
          </ul>
        </div>
      </container>
    </block>
  </div>
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
