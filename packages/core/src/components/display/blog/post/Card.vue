<!-- HEALTH:HIGH blog-post-card -->
<template>
  <div class="blogPostCard color color--basic stack-5" :class="postColor">
    <smart-link class="block" :href="post.href" :title="post.title">
      <aspect-ratio class="pb-75p col-5:pb-100p">
        <figure class="overflow-hidden h-full colorInherit--bg transition-bg">
          <img
            v-if="post.thumbnail.url"
            :src="post.thumbnail.url"
            :alt="post.title"
            class="w-full h-full object-cover"
            loading="lazy"
          />
        </figure>
      </aspect-ratio>
    </smart-link>
    <div class="stack-5 mx-5 col-5:mx-0 col-7:mr-20p">
      <div class="text-slate-50 dark:text-cream-600 heading-sub">
        {{ post.categories | prismicCategory }} |
        {{ post.published_date | prismicDate }}
      </div>
      <smart-link class="block stack-exception my-3" :href="post.href">
        <h2 class="heading-h3">
          {{ post.title }}
        </h2>
      </smart-link>
      <p class="text-slate dark:text-cream">
        {{ post.excerpt }}
      </p>
      <smart-link
        :href="post.href"
        class="font-bold inline-block"
        :title="post.title"
      >
        Read post
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

<style lang="sass" scoped>
.blogPostCard
  .aspectRatio
    border-bottom: 20px solid

    @screen col-5
      figure, img
        will-change: transform
        @apply transition-transform

      figure
        transform-origin: 50% 100%
        transform: scaleY(0.95)

      img
        transform: scaleY(1.05)

  @screen col-5
    .smartLink
      &:focus[data-focus-visible-added], &:hover
        figure
          transform: scaleY(1)

        img
          transform: scale(1.1)
</style>
