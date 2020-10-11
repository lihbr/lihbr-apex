<!-- HEALTH:HIGH blog-post-content -->
<template>
  <div class="blogPostContent">
    <rich-text
      class="article text-l col-5:text-xl leading-relaxed richText richText--heading color color--current color--richText"
      tag="article"
      :content="content"
    />
  </div>
</template>

<script>
import RichText from "~/components/controls/RichText.vue";

export default {
  components: {
    RichText
  },
  props: {
    content: {
      type: String,
      default: ""
    }
  }
};
</script>

<style lang="sass" scoped>
.blogPostContent
  .article::v-deep
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

    // YouTube embed
    & > * + [data-oembed],
    & > [data-oembed] + *
      @apply mt-16

      @screen col-5
        @apply mt-24

    // **** //
    // Size //
    // **** //

    // Every tag
    h1, h2, h3, h4, h5, h6, p, blockquote, figure, ul, ol, .prism, [data-oembed]
      @apply max-w-col-6 mx-auto

    // Img tag & prism
    figure, .prism
      @apply max-w-col-7

    // Img tag with copyright & YouTube
    figure[data-copyright], [data-oembed]
      @apply max-w-col-8 relative

    // ******* //
    // General //
    // ******* //

    // Heading anchors
    h1, h2, h3, h4, h5, h6
      @apply relative
      scroll-margin-top: theme("spacing.32")

      &::before
        content: "#"
        will-change: opacity
        @apply absolute top-0 right-100p pr-1 opacity-0 transition-opacity duration-base ease-base block

        @screen col-5
          @apply pr-3

      &:hover::before
        @apply opacity-100

    // Hyperlink
    a:not(.pageAnchor)
      @apply underline

    // Images
    figure
      @apply overflow-hidden

      &[data-copyright]
        &::before
          content: attr(data-copyright)
          will-change: opacity
          @apply absolute top-3 right-3 bg-white block px-1 rounded opacity-60 transition-opacity duration-base ease-base text-s font-mono font-normal

          @screen col-5
            @apply text-m

        &:hover::before
          @apply opacity-100

    // Inline code
    code.inline
      @apply bg-slate-o-10 rounded font-normal text-m
      padding: 2px 6px

      @screen col-5
        @apply text-l

    // Quote
    blockquote
      @apply font-sub font-normal text-l relative italic

      @screen col-5
        @apply text-xl

      &::before
        content: ""
        padding-right: 0.375rem
        @apply h-full block absolute top-0 right-100p border-l-4

        @screen col-5
          @apply pr-3

    // Lists
    ul, ol
      @apply pl-5

    ul
      @apply list-disc

    ol
      @apply list-decimal

    // Code
    .prism
      @apply max-h-80vh text-s

      @screen col-5
        @apply text-m

    // Embed

    // YouTube
    [data-oembed]
      padding-bottom: 56.25% // 16:9 aspect ratio

      iframe
        @apply absolute top-0 left-0 w-full h-full
</style>
