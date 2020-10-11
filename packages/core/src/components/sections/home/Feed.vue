<!-- HEALTH:HIGH home-feed -->
<template>
  <div class="homeFeed">
    <ul class="-my-16 col-5:-mx-5">
      <li
        v-for="(post, index) in posts"
        :key="`${post.href}-${index}`"
        class="cardWrapper py-16 col-5:px-5 col-5:inline-block col-5:w-1/2"
      >
        <blog-post-card :post="post" />
      </li>
    </ul>
  </div>
</template>

<script>
import BlogPostCard from "~/components/display/blog/post/Card.vue";

export default {
  components: {
    BlogPostCard
  },
  props: {
    posts: {
      type: Array,
      default: () => []
    }
  }
};
</script>

<style lang="sass" scoped>
.homeFeed
  @screen col-5
    transform: translateY(-8rem)
    margin-top: -12rem // 8rem + 4rem to compensate ul negative margin
    padding-bottom: 16rem

    .cardWrapper:nth-child(even)
      transform: translateY(16rem)
</style>
