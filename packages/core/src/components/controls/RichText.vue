<!-- HEALTH:HIGH rich-text -->
<template>
  <!-- eslint-disable-next-line vue/no-v-html -->
  <component :is="as" class="richText" v-html="content" />
</template>

<script>
export default {
  props: {
    as: {
      type: String,
      required: false,
      default: "div"
    },
    content: {
      type: String,
      required: true
    }
  },
  watch: {
    content() {
      this.removeListeners();
      this.$nextTick(this.addListeners.bind(this));
    }
  },
  mounted() {
    this.$nextTick(this.addListeners);
  },
  beforeDestroy() {
    this.removeListeners();
  },
  methods: {
    navigate(event) {
      let target = event.target;
      let i = 0;
      // Go throught 5 parents max to find a tag
      while (
        i < 5 &&
        !(target instanceof HTMLAnchorElement) &&
        target.parentNode
      ) {
        target = target.parentNode;
        i++;
      }
      // If target is still not a link, ignore
      if (!(target instanceof HTMLAnchorElement)) {
        return;
      }
      const href = target.getAttribute("href");
      // Get link target, if internal link, navigate with router link
      const regex = /^\/(?!\/|assets).*$/gm; // match internal links
      if (href && regex.test(href)) {
        event.preventDefault();
        this.$router.push(href);
      }
    },
    addListeners() {
      this.$options._$links = this.$el.querySelectorAll("a[data-nuxt-link]");
      for (const link of this.$options._$links) {
        link.addEventListener("click", this.navigate.bind(this));
      }
    },
    removeListeners() {
      for (const link of this.$options._$links) {
        link.removeEventListener("click", this.navigate.bind(this));
      }
      this.$options._$links = [];
    }
  }
};
</script>
