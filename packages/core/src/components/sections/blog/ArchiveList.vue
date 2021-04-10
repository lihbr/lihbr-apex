<!-- HEALTH:HIGH blog-archive-list -->
<template>
  <ul class="stack-24 col-5:stack-32">
    <li v-for="year in sortedOrder" :key="year">
      <blog-archive :title="year" :posts="sortedBlogPosts[year]" />
    </li>
  </ul>
</template>

<script>
import BlogArchive from "~/components/display/blog/Archive.vue";

export default {
  components: {
    BlogArchive
  },
  props: {
    sortedOrder: {
      type: Array,
      required: false,
      default: () => []
    },
    sortedBlogPosts: {
      type: Object,
      required: false,
      default: () => ({})
    }
  }
};
</script>
