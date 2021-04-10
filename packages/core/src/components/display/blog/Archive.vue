<!-- HEALTH:HIGH blog-archive -->
<template>
  <section class="blogArchive">
    <div
      class="flex items-center mb-5 col-5:mb-12 color color--basic"
      :class="randomColor"
    >
      <h2 class="heading-h2">
        {{ title }}
      </h2>
      <hr class="flex-1 ml-3" />
    </div>
    <ul class="-my-5 col-5:-mx-5">
      <li
        v-for="post in posts"
        :key="post.id"
        class="py-5 col-5:px-5 col-7:inline-block col-7:w-1/2"
      >
        <blog-post-thumbnail :post="post" />
      </li>
    </ul>
  </section>
</template>

<script>
import BlogPostThumbnail from "~/components/display/blog/post/Thumbnail.vue";

import themes from "~/assets/data/themes.json";

export default {
  components: {
    BlogPostThumbnail
  },
  props: {
    title: {
      type: String,
      required: true
    },
    posts: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      randomColor: "color--current"
    };
  },
  mounted() {
    this.randomColor = `color--${
      themes[Math.floor(Math.random() * themes.length)]
    }`;
  }
};
</script>
