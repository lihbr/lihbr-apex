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
      required: false,
      default: true
    },
    threshold: {
      type: Number,
      required: false,
      default: 1000
    },
    assumeNoError: {
      type: Boolean,
      required: false,
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
        const [res, _] = await Promise.all([
          fetch(this.action, {
            method: "POST",
            body: JSON.stringify(this.formData)
          }),
          new Promise(res => setTimeout(res, this.threshold))
        ]);

        if (!res.ok) {
          throw res;
        }
      } catch (err) {
        // TODO: Probably find a way to get rid of assume-no-error
        console.error(err);
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
