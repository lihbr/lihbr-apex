<!-- HEALTH:HIGH art-credit-info -->
<template>
  <div class="artCreditInfo italic">
    <span class="date">Posted on {{ art.published_date | prismicDate }}</span>
    <div v-if="art.credit_submitter_name">
      Thanks to a submission from
      <smart-link
        :class="{ underline: art.credit_submitter_link.href }"
        :href="art.credit_submitter_link.href"
        blank
      >
        {{ art.credit_submitter_name }}
      </smart-link>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    art: {
      type: Object,
      required: true
    }
  }
};
</script>
