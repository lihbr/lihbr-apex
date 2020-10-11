<!-- HEALTH:HIGH blog-archive-list -->
<template>
  <div class="blogArchiveList">
    <ul class="stack-24 col-5:stack-32">
      <li v-for="(year, index) in sortedOrder" :key="`${year}-${index}`">
        <blog-archive :title="year" :posts="sortedBlogPosts[year]" />
      </li>
    </ul>
  </div>
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
      default: () => []
    },
    sortedBlogPosts: {
      type: Object,
      default: () => ({})
    }
  }
};
</script>
