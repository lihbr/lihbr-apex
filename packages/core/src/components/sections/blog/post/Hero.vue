<!-- HEALTH:HIGH blog-post-hero -->
<template>
  <header
    class="blogPostHero pt-25vh pb-12 col-6:pb-32 max-w-col-8 mx-auto col-6:flex col-6:items-start"
  >
    <div class="stack-5 col-6:w-1/2 col-6:pr-5 mb-12 col-6:mb-0">
      <div
        class="stack-exception mb-3 text-slate-50 dark:text-cream-600 heading-sub"
      >
        {{ data.categories | prismicCategory }} |
        {{ data.published_date | prismicDate }}
      </div>
      <h1 class="heading-h1 color color--current color--basic">
        {{ data.title }}
      </h1>
      <p class="paragraph-lead">
        {{ data.lead_text }}
      </p>
    </div>
    <aspect-ratio
      as="figure"
      class="pb-100p col-6:w-1/2 col-6:pb-50p color color--current color--bg transition-bg"
    >
      <img
        v-if="data.thumbnail.url"
        :src="data.thumbnail.url"
        :alt="data.title"
        class="w-full h-full object-cover"
        loading="lazy"
      />
    </aspect-ratio>
  </header>
</template>

<script>
import AspectRatio from "~/components/layouts/AspectRatio.vue";

export default {
  components: {
    AspectRatio
  },
  props: {
    data: {
      type: Object,
      required: true
    }
  }
};
</script>
