<!-- HEALTH:MID __page__error -->
<template>
  <div class="__page__error">
    <screen
      class="content color color--current color--basic flex items-center justify-center"
    >
      <smart-link
        v-if="!isPreview"
        href="/"
        class="block"
        :external="$route.path === '/'"
        title="Get back to home"
      >
        <common-context-information :title="code" :message="message">
          <template #post>
            <div class="stack-exception mt-3 text-s underline">
              Back to home
            </div>
          </template>
        </common-context-information>
      </smart-link>
      <common-context-information
        v-else
        title="⚆_⚆"
        message="Loading preview..."
      />
    </screen>
  </div>
</template>

<script>
import statuses from "statuses";

import CommonContextInformation from "~/components/display/common/ContextInformation.vue";

const unknown = "Welp, that's a unexpected.";

export default {
  components: {
    CommonContextInformation
  },
  props: {
    error: {
      type: Object,
      default: () => ({
        statusCode: 0,
        message: ""
      })
    }
  },
  data() {
    return {
      isPreview: false
    };
  },
  head() {
    return this.$buildHead({
      title: `${this.code}` || "💐",
      description: this.$options.filters.uc_first(this.message),
      metaImage: { og: undefined, tw: undefined },
      path: this.$route.path
    });
  },
  computed: {
    code() {
      return String(this.error.statusCode);
    },
    message() {
      try {
        return statuses(this.code);
      } catch (err) {
        return unknown;
      }
    }
  },
  mounted() {
    // Scroll to top if navigating to error page
    window.scrollTo(0, 0);

    this.$store.dispatch("pageChanged");
    if (this.$prismicPreview.hasQuery()) {
      this.isPreview = true;
      this.$options._timeout = setTimeout(() => {
        this.isPreview = false;
      }, 4000);
    }
  },
  destroyed() {
    if (this.$options._timeout) {
      clearTimeout(this.$options._timeout);
    }
  }
};
</script>
