<!-- HEALTH:HIGH text-emphasis -->
<template>
  <div class="textEmphasis">
    <block class="bg-cream">
      <container>
        <div
          class="col-7:flex col-7:justify-between richText richText--heading color color--current color--richText"
        >
          <rich-text
            class="main mb-16 col-7:mb-0 col-7:w-col-3 col-9:w-col-4 text-l col-7:text-xl leading-relaxed"
            :content="slice.primary.main_html"
          />
          <rich-text
            class="sub col-7:w-col-3 col-9:w-col-4 text-l leading-relaxed"
            :content="slice.primary.sub_html"
          />
        </div>
      </container>
    </block>
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

<style lang="sass" scoped>
.textEmphasis
  .main::v-deep, .sub::v-deep
    // ***** //
    // Stack //
    // ***** //

    // Every tag
    & > * + *
      @apply mt-5

    // Img tag with copyright
    & > * + figure[data-copyright],
    & > figure[data-copyright] + *
      @apply mt-16

      @screen col-5
        @apply mt-24

    // **** //
    // Size //
    // **** //

    // Every tag
    h1, h2, h3, h4, h5, h6, p, blockquote, figure, ul, ol
      @apply max-w-col-6 mx-auto

    // Img tag with copyright
    figure[data-copyright]
      @apply max-w-col-8 relative

    // ******* //
    // General //
    // ******* //

    // Heading anchors
    h1, h2, h3, h4, h5, h6
      scroll-margin-top: theme("spacing.32")

    // Hyperlink
    .pageAnchor
      @apply cursor-text

    a:not(.pageAnchor)
      @apply underline

    // Images
    figure
      @apply overflow-hidden

      &[data-copyright]
        &::before
          @apply absolute top-3 right-3 block px-1 rounded opacity-60 transition-opacity duration-base ease-base text-cream bg-slate-100 leading-relaxed font-mono text-m
          content: attr(data-copyright)
          will-change: opacity

        &:hover::before
          @apply opacity-100

    // Lists
    ul, ol
      @apply pl-5

    ul
      @apply list-disc

    ol
      @apply list-decimal
</style>
