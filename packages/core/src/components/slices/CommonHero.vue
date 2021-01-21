<!-- HEALTH:HIGH common-hero -->
<template>
  <div
    class="commonHero pb-5"
    :class="{
      'min-h-screen': slice.primary.fullscreen,
      'pb-24': !slice.primary.fullscreen,
      'col-5:pb-32': !slice.primary.fullscreen
    }"
  >
    <container
      class="pt-25vh"
      :class="{ 'col-5:text-center': slice.primary.centered }"
    >
      <div class="stack-5">
        <h1 class="heading-h1">
          <span class="block text-slate-50 dark:text-cream-600">
            {{ slice.primary.title_first_half }}
          </span>
          <span class="block color color--current color--basic">
            {{ slice.primary.title_second_half }}
          </span>
        </h1>
        <rich-text
          v-if="slice.primary.text_html"
          class="paragraph-lead underlinedLinks"
          :class="{
            'max-w-col-5': !slice.primary.centered,
            'max-w-col-6': slice.primary.centered,
            'mx-auto': slice.primary.centered
          }"
          :content="slice.primary.text_html"
        />
      </div>
    </container>
  </div>
</template>

<script>
import RichText from "~/components/controls/RichText.vue";

export default {
  components: {
    RichText
  },
  props: {
    slice: {
      type: Object,
      required: true
    }
  }
};
</script>
