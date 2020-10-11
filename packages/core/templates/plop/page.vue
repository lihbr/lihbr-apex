<!-- HEALTH:UNKNOWN __page__{{ kebabCase route }} -->
<template>
  <page-builder class="__page__{{ kebabCase route }}" :slices="data.slices">
    <div class="content">
      <container>
        {{ pascalCase route }}
      </container>
    </div>
  </page-builder>
</template>

<script>
import PageBuilder from "~/components/controls/PageBuilder.vue";

export default {
  components: {
    PageBuilder
  },
  async asyncData(context) {
    if (context.$prismicPreview.hasToken()) {
      return await context.$prismicPreview.get(context.route.path);
    }
    return await context.$pagePayload(context);
  },
  head() {
    const { meta_title, meta_description, meta_image } = this.data;
    return this.$buildHead({
      title: meta_title || "💐",
      description: meta_description,
      metaImage: { og: meta_image.url, tw: meta_image.twitter_variant.url },
      path: this.$route.path
    });
  },
  mounted() {
    this.$store.dispatch("pageChanged");
  }
};
</script>

<style lang="sass" scoped>
// .__page__{{ kebabCase route }}
</style>
