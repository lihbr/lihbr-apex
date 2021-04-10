<!-- HEALTH:HIGH page-builder -->
<template>
  <div class="pageBuilder">
    <slot name="pre-slices" />
    <div
      v-for="(slice, index) in slices"
      :id="`${slice.slice_type}-${index}`"
      :key="`${slice.slice_type}-${index}`"
      :class="`${slice.slice_type}`"
    >
      <component
        :is="slice.slice_type"
        v-if="slice.slice_type !== '__page-content'"
        :slice="slice"
      />
      <slot v-else />
    </div>
    <slot name="post-slices" />
  </div>
</template>

<script>
import CommonHero from "~/components/slices/CommonHero.vue";
import RecentBlogPosts from "~/components/slices/RecentBlogPosts.vue";
import Art from "~/components/slices/Art.vue";
import TextEmphasis from "~/components/slices/TextEmphasis.vue";
import LinkEmphasis from "~/components/slices/LinkEmphasis.vue";

export default {
  components: {
    CommonHero,
    RecentBlogPosts,
    Art,
    TextEmphasis,
    LinkEmphasis
  },
  props: {
    slices: {
      type: Array,
      required: false,
      default: () => [
        {
          slice_type: "__page-content"
        }
      ]
    }
  }
};
</script>
