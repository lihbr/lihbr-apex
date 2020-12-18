<!-- HEALTH:HIGH blog-post-share -->
<template>
  <div class="blogPostShare">
    <div class="color color--current color--basic">
      <div class="text-slate mb-3 italic text-s">Like what you read?</div>
      <div class="col-5:flex col-5:justify-between col-5:items-center">
        <smart-link
          :href="twitterDiscuss"
          title="Discuss on Twitter"
          blank
          class="block mb-3 col-5:mb-0"
        >
          <simple-button class="colorInherit--bg w-full" tag="div">
            Discuss on Twitter
            <twitter-svg class="ml-1 h-4 w-4" aria-hidden="true" />
          </simple-button>
        </smart-link>
        <ul class="-mx-3 flex">
          <li
            class="text-slate italic text-s px-3 flex items-center flex-1"
            aria-hidden="true"
          >
            Share on:
          </li>
          <li class="shareCta">
            <smart-link :href="twitterLink" title="Share post on Twitter" blank>
              <twitter-svg />
            </smart-link>
          </li>
          <li class="shareCta">
            <smart-link
              :href="facebookLink"
              title="Share post on Facebook"
              blank
            >
              <facebook-svg aria-hidden="true" />
            </smart-link>
          </li>
          <li class="shareCta">
            <smart-link
              :href="linkedinLink"
              title="Share post on LinkedIn"
              blank
            >
              <linkedin-svg aria-hidden="true" />
            </smart-link>
          </li>
          <li v-if="canNativeShare" class="shareCta">
            <div
              class="nativeShare cursor-pointer"
              title="Share this post"
              @click="nativeShare"
            >
              <share-svg aria-hidden="true" />
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import SimpleButton from "~/components/controls/SimpleButton.vue";

import TwitterSvg from "~/assets/icons/twitter.svg";
import FacebookSvg from "~/assets/icons/facebook.svg";
import LinkedinSvg from "~/assets/icons/linkedin.svg";
import ShareSvg from "~/assets/icons/share.svg";

export default {
  components: {
    SimpleButton,

    TwitterSvg,
    FacebookSvg,
    LinkedinSvg,
    ShareSvg
  },
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      canNativeShare: false
    };
  },
  computed: {
    currentLink() {
      return `${process.env.APP_URL}${this.data._ctx.href}`;
    },
    twitterDiscuss() {
      return `https://mobile.twitter.com/search?q=${this.currentLink}`;
    },
    twitterLink() {
      return `https://twitter.com/intent/tweet?url=${
        this.currentLink
      }&text=${this.data.title.replace(/\s/g, "+")}`;
    },
    facebookLink() {
      return `https://www.facebook.com/sharer/sharer.php?u=${this.currentLink}`;
    },
    linkedinLink() {
      return `https://www.linkedin.com/shareArticle?mini=true&url=${
        this.currentLink
      }&title=${this.data.title.replace(
        /\s/g,
        "+"
      )}&summary=${this.data.lead_text.replace(/\s/g, "+")}`;
    },
    shareData() {
      return {
        url: this.currentLink,
        text: this.data.lead_text,
        title: this.data.title
      };
    }
  },
  mounted() {
    if (typeof navigator !== "undefined" && navigator.share) {
      this.canNativeShare = true;
    }
  },
  methods: {
    async nativeShare(e) {
      if (!this.canNativeShare) {
        return;
      }

      try {
        await navigator.share(this.shareData);
      } catch (err) {
        console.error(err);
      }
    }
  }
};
</script>

<style lang="sass" scoped>
.blogPostShare
  .shareCta
    .smartLink, .nativeShare
      @apply block py-1 px-3 transition-color duration-base ease-base

      svg
        @apply w-5 h-5 fill-current

      &:not([data-focus-visible-added]):not(:hover)
        @apply text-slate-50

      &:focus[data-focus-visible-added], &:hover
        @apply duration-1/2 ease-base
</style>
