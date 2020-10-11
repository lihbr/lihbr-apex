<!-- HEALTH:MID simple-form -->
<template>
  <form class="simpleForm" @submit.prevent="submit">
    <slot
      :status="status"
      :disabled="status !== 'pending' && status !== 'error'"
    />
  </form>
</template>

<script>
import fetch from "isomorphic-unfetch";

export default {
  props: {
    formData: {
      type: Object,
      required: true
    },
    action: {
      type: String,
      required: true
    },
    canSubmit: {
      type: Boolean,
      default: true
    },
    threshold: {
      type: Number,
      default: 1000
    },
    assumeNoError: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      status: "pending"
    };
  },
  methods: {
    async submit() {
      if (!this.canSubmit || this.status === "success") {
        return;
      }

      this.status = "submitting";
      this.$emit("submit", this.formData);

      try {
        await Promise.all([
          fetch(this.action, {
            method: "POST",
            body: JSON.stringify(this.formData)
          }),
          new Promise(res => setTimeout(res, this.threshold))
        ]);
      } catch (err) {
        // TODO: Probably find a way to get rid of assume-no-error
        this.$logger.error(err);
        this.$sentry.captureException(err);
        if (!this.assumeNoError) {
          this.status = "error";
          return;
        }
      }

      this.status = "success";
    }
  }
};
</script>
