<!-- HEALTH:HIGH blog-post-thumbnail -->
<template>
  <div
    :class="postColor"
    class="blogPostThumbnail flex color color--basic justify-between"
  >
    <div class="hidden col-5:block w-col">
      <aspect-ratio tag="figure" class="pb-100p colorInherit--bg transition-bg">
        <smart-link :href="post.href" class="block h-full" :title="post.title">
          <img
            v-if="post.thumbnail.url"
            :src="post.thumbnail.url"
            :alt="post.title"
            class="w-full h-full object-cover"
            loading="lazy"
          />
        </smart-link>
      </aspect-ratio>
    </div>
    <div class="col-5:ml-5 flex-1 stack-3">
      <div class="text-slate-50 dark:text-cream-600 heading-sub">
        {{ post.categories | prismicCategory }} |
        {{ post.published_date | prismicDate }}
      </div>
      <smart-link class="block heading-h3" :href="post.href">
        {{ post.title }}
      </smart-link>
    </div>
  </div>
</template>

<script>
import AspectRatio from "~/components/layouts/AspectRatio.vue";

export default {
  components: {
    AspectRatio
  },
  props: {
    post: {
      type: Object,
      required: true
    }
  },
  computed: {
    postColor() {
      return this.post.color
        ? `color--${this.post.color.toLowerCase()}`
        : "color--current";
    }
  }
};
</script>
