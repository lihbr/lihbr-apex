<!-- HEALTH:MID contact-form -->
<template>
  <div class="contactForm">
    <simple-form
      v-slot="form"
      :form-data="contactForm"
      action="/api/v1/contact"
      :can-submit="canSubmit"
      assume-no-error
      aria-live="polite"
    >
      <transition name="fade" mode="out-in">
        <div v-if="form.status === 'success'" key="success" class="text-center">
          <div class="heading-h2 color color--current color--basic mb-5">
            {{ wording.success.title }}
          </div>
          <rich-text
            class="stack-3 underlinedLinks"
            :content="wording.success.description_html"
          />
        </div>
        <div
          v-else-if="form.status === 'submitting'"
          key="submitting"
          class="text-center"
        >
          <div class="heading-h2 color color--current color--basic mb-5">
            {{ wording.submitting.title }}
          </div>
          <rich-text
            class="stack-3 underlinedLinks"
            :content="wording.submitting.description_html"
          />
        </div>
        <div v-else key="form" class="stack-5 col-7:stack-12">
          <input-wrapper>
            <label
              :for="ids.name"
              class="heading-h3 color color--current color--basic"
            >
              Name
              <hr />
            </label>
            <input
              :id="ids.name"
              v-model="contactForm.name"
              type="text"
              name="name"
              placeholder="Your name,"
              required
              :disabled="form.disabled"
            />
          </input-wrapper>
          <input-wrapper>
            <label
              :for="ids.email"
              class="heading-h3 color color--current color--basic"
            >
              Email
              <hr />
            </label>
            <input
              :id="ids.email"
              v-model="contactForm.email"
              type="email"
              name="email"
              placeholder="Email,"
              required
              :disabled="form.disabled"
            />
          </input-wrapper>
          <input-wrapper>
            <label
              :for="ids.body"
              class="heading-h3 color color--current color--basic"
            >
              Message
              <hr />
            </label>
            <autosize-textarea
              :id="ids.body"
              v-model="contactForm.body"
              name="body"
              placeholder="And message~"
              required
              :disabled="form.disabled"
              rows="1"
              class="overflow-hidden"
            />
          </input-wrapper>
          <div class="col-7:flex col-7:items-start col-7:justify-end">
            <simple-button
              class="color color--current color--text color--bg w-full col-7:w-1/2"
              type="submit"
              :disabled="!canSubmit || form.disabled"
            >
              Send<send-svg class="h-4 w-4 ml-1" aria-hidden="true" />
            </simple-button>
          </div>
        </div>
      </transition>
    </simple-form>
  </div>
</template>

<script>
import RichText from "~/components/controls/RichText.vue";

import InputWrapper from "~/components/controls/InputWrapper.vue";
import SimpleButton from "~/components/controls/SimpleButton.vue";
import SimpleForm from "~/components/controls/SimpleForm.vue";
import AutosizeTextarea from "~/components/controls/AutosizeTextarea.vue";

import SendSvg from "~/assets/icons/send.svg";

export default {
  components: {
    RichText,

    InputWrapper,
    SimpleButton,
    SimpleForm,
    AutosizeTextarea,

    SendSvg
  },
  props: {
    wording: {
      type: Object,
      required: true
    },
    idPrefix: {
      type: String,
      default: "form"
    }
  },
  data() {
    return {
      contactForm: {
        name: "",
        email: "",
        body: ""
      }
    };
  },
  computed: {
    ids() {
      return {
        name: `${this.idPrefix}-name`,
        email: `${this.idPrefix}-email`,
        body: `${this.idPrefix}-body`
      };
    },
    canSubmit() {
      if (!this.contactForm.name) {
        return false;
      }

      if (!this.contactForm.email || !this.contactForm.email.includes("@")) {
        return false;
      }

      if (!this.contactForm.body) {
        return false;
      }

      return true;
    }
  }
};
</script>

<style lang="sass" scoped>
.contactForm
  .fade-enter-active, .fade-leave-active
    will-change: opacity
    @apply transition-opacity duration-1/2

  .fade-enter, .fade-leave-to
    @apply opacity-0

  .inputWrapper
    @screen col-7
      @apply flex items-start

  label, input, textarea
    @apply w-full

    @screen col-7
      @apply w-1/2

  label
    @apply mb-3 flex items-center

    @screen col-7
      @apply mb-0

    hr
      @apply flex-1 ml-3

      @screen col-7
        @apply mr-3

  input, textarea
    @apply py-2 -my-2

    @screen col-7
      @apply text-xl
</style>
