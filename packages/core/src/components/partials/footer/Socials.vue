<!-- HEALTH:HIGH footer-socials -->
<template>
  <div class="footerSocials">
    <ul class="col-6:flex -my-5 col-6:my-0 col-6:-mx-5">
      <li
        v-for="(social, index) in socials"
        :key="`${social.type}-${index}`"
        class="py-5 col-6:py-0 col-6:mx-5 col-6:max-w-col-2 w-full"
      >
        <decorated-link
          v-if="social.type"
          :href="social.link.href"
          :title="social.type"
          :blank="social.link.blank"
          :description="social.description"
          large
        >
          <component
            :is="`${social.type.toLowerCase()}-svg`"
            class="w-inherit h-inherit"
            aria-hidden="true"
          />
        </decorated-link>
      </li>
    </ul>
  </div>
</template>

<script>
import DecoratedLink from "~/components/controls/DecoratedLink.vue";

import TwitterSvg from "~/assets/icons/twitter.svg";
import FacebookSvg from "~/assets/icons/facebook.svg";
import InstagramSvg from "~/assets/icons/instagram.svg";
import LinkedinSvg from "~/assets/icons/linkedin.svg";
import GithubSvg from "~/assets/icons/github.svg";
import EmailSvg from "~/assets/icons/email.svg";
import LinkSvg from "~/assets/icons/link.svg";

export default {
  components: {
    DecoratedLink,

    TwitterSvg,
    FacebookSvg,
    InstagramSvg,
    LinkedinSvg,
    GithubSvg,
    EmailSvg,
    LinkSvg
  },
  computed: {
    socials() {
      return this.$store.state.content.settings.socials;
    }
  }
};
</script>
