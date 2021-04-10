<!-- HEALTH:HIGH __page__art -->
<template>
  <page-builder class="__page__art" :slices="data.slices">
    <block class="content" trailing as="main">
      <container>
        <art-card :art="$store.state.content.arts[0]" />
        <block>
          <art-form id-prefix="inContent" :wording="data.form" />
        </block>
        <art-card-list :arts="otherArts" />
      </container>
    </block>
    <template #post-slices>
      <block>
        <container>
          <art-form id-prefix="footer" :wording="data.form" />
        </container>
      </block>
    </template>
  </page-builder>
</template>

<script>
import PageBuilder from "~/components/controls/PageBuilder.vue";

import ArtCard from "~/components/display/art/Card.vue";
import ArtForm from "~/components/display/art/Form.vue";
import ArtCardList from "~/components/display/art/CardList.vue";

export default {
  components: {
    PageBuilder,

    ArtCard,
    ArtForm,
    ArtCardList
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
  computed: {
    otherArts() {
      return this.$store.state.content.arts.slice(1);
    }
  },
  mounted() {
    this.$store.dispatch("pageChanged");
  }
};
</script>
