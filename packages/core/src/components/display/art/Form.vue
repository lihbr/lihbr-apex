<!-- HEALTH:MID art-form -->
<template>
  <div class="artForm">
    <simple-form
      v-slot="form"
      autocomplete="off"
      :form-data="artForm"
      action="/api/v1/art"
      :can-submit="canSubmit"
      assume-no-error
      @click.native.once="active = true"
      @submit="onSubmit"
    >
      <art-card-layout
        :expandable="active"
        :expanded="active && form.status === 'pending'"
      >
        <template #frame>
          <div
            class="banner p-5 max-h-40vh col-7:max-h-none h-col-4 border-2 border-dashed flex items-center justify-center color color--current color--basic"
            aria-live="polite"
            @click="focus"
          >
            <transition name="fade" mode="out-in">
              <div
                v-if="form.status === 'success'"
                key="success"
                class="text-center max-w-col-3"
              >
                <div class="heading-h2 mb-5">
                  {{ wording.success.title }}
                </div>
                <rich-text
                  class="stack-3 text-slate underlinedLinks"
                  :content="wording.success.description_html"
                />
              </div>
              <div
                v-else-if="form.status === 'submitting'"
                key="submitting"
                class="text-center max-w-col-3"
              >
                <div class="heading-h2 mb-5">
                  {{ wording.submitting.title }}
                </div>
                <rich-text
                  class="stack-3 text-slate underlinedLinks"
                  :content="wording.submitting.description_html"
                />
              </div>
              <div
                v-else-if="!canSubmit"
                key="cannotSubmit"
                class="text-center max-w-col-3"
              >
                <div class="heading-h2 mb-5">
                  {{ wording.cannotSubmit.title }}
                </div>
                <rich-text
                  class="stack-3 text-slate underlinedLinks"
                  :content="wording.cannotSubmit.description_html"
                />
              </div>
              <div v-else key="canSubmit" class="text-center max-w-col-3">
                <div class="heading-h2 mb-5">
                  {{ wording.canSubmit.title }}
                </div>
                <rich-text
                  class="stack-3 text-slate underlinedLinks"
                  :content="wording.canSubmit.description_html"
                />
              </div>
            </transition>
          </div>
        </template>
        <template #aside>
          <transition name="fade" mode="out-in">
            <div
              v-if="!form.disabled"
              key="form"
              class="col-5:flex col-5:justify-between col-7:h-full col-7:flex-col"
            >
              <div
                class="artist stack-3 mb-3 col-5:mb-0 col-7:mb-3 col-5:mr-5 col-7:mr-0 col-5:flex-1"
              >
                <input-wrapper
                  class="heading-h3 color color--current color--basic"
                >
                  <label :for="ids.credit_artist_name" class="text-slate-50">
                    I want to share...
                  </label>
                  <input
                    :id="ids.credit_artist_name"
                    ref="artistName"
                    v-model="artForm.credit_artist_name"
                    type="text"
                    name="artistName"
                    placeholder="Artist Name"
                    required
                    :disabled="form.disabled"
                    @focus.once="onInputFocus"
                  />
                </input-wrapper>

                <input-wrapper class="small">
                  <label :for="ids.credit_artist_link">
                    You can find them here:
                  </label>
                  <input
                    :id="ids.credit_artist_link"
                    v-model="artForm.credit_artist_link.href"
                    type="url"
                    name="artistLink"
                    placeholder="Link to Website, Wikipedia, etc. (https://...)"
                    required
                    :disabled="form.disabled"
                    @focus.once="onInputFocus"
                  />
                </input-wrapper>

                <input-wrapper class="small">
                  <label :for="ids.credit_artist_details">
                    Here's why they are cool:
                  </label>
                  <textarea
                    :id="ids.credit_artist_details"
                    v-model="artForm.credit_artist_details"
                    name="artistDetails"
                    placeholder="Anything you want me to know about this artist. If there's an art from them you want me to share in particular, something I must know or check, etc."
                    class="h-24 col-7:h-32 resize-none"
                    required
                    :disabled="form.disabled"
                    @focus.once="onInputFocus"
                  />
                </input-wrapper>
              </div>
              <div class="submitter stack-3 col-5:max-w-col-2 col-7:max-w-none">
                <input-wrapper class="small">
                  <label :for="ids.credit_submitter_name">
                    If you want to show people you have good taste you can leave
                    your details below, both fields are optional:
                  </label>
                  <input
                    :id="ids.credit_submitter_name"
                    v-model="artForm.credit_submitter_name"
                    type="text"
                    name="submitterName"
                    placeholder="Your name, pseudo, whatever..."
                    :disabled="form.disabled"
                    @focus.once="onInputFocus"
                  />
                </input-wrapper>

                <input-wrapper class="small">
                  <label :for="ids.credit_submitter_link">
                    A link to your:
                  </label>
                  <input
                    :id="ids.credit_submitter_link"
                    v-model="artForm.credit_submitter_link.href"
                    type="url"
                    name="submitterLink"
                    placeholder="Twitter, Website, etc."
                    :disabled="form.disabled"
                    @focus.once="onInputFocus"
                  />
                </input-wrapper>

                <div class="text-right">
                  <div class="inline-block">
                    <simple-button
                      class="color color--current color--text color--bg"
                      type="submit"
                      :disabled="!canSubmit || form.disabled"
                    >
                      Submit
                      <send-svg class="h-4 w-4 ml-1" aria-hidden="true" />
                    </simple-button>
                  </div>
                </div>
              </div>
            </div>
            <art-credit
              v-else
              key="preview"
              class="col-7:h-full col-7:flex col-7:flex-col col-7:justify-between"
              :art="artForm"
            />
          </transition>
        </template>
      </art-card-layout>
    </simple-form>
  </div>
</template>

<script>
import RichText from "~/components/controls/RichText.vue";

import InputWrapper from "~/components/controls/InputWrapper.vue";
import SimpleButton from "~/components/controls/SimpleButton.vue";
import SimpleForm from "~/components/controls/SimpleForm.vue";

import ArtCardLayout from "~/components/display/art/CardLayout.vue";

import ArtCredit from "~/components/display/art/credit/Credit.vue";

import SendSvg from "~/assets/icons/send.svg";

import getEvent, { CATEGORIES, ACTIONS } from "~/assets/js/gtm";

export default {
  components: {
    RichText,

    InputWrapper,
    SimpleButton,
    SimpleForm,

    ArtCardLayout,

    ArtCredit,

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
      active: false,
      artForm: {
        type: "Art",
        credit_artist_name: "",
        credit_artist_link: {
          href: ""
        },
        published_date: `${new Date().getFullYear()}-${`0${
          new Date().getMonth() + 1
        }`.slice(-2)}-${`0${new Date().getDate()}`.slice(-2)}`,
        credit_artist_details: "",
        credit_submitter_name: "",
        credit_submitter_link: { href: "" }
      }
    };
  },
  computed: {
    ids() {
      return {
        credit_artist_name: `${this.idPrefix}-credit_artist_name`,
        credit_artist_link: `${this.idPrefix}-credit_artist_link`,
        credit_artist_details: `${this.idPrefix}-credit_artist_details`,
        credit_submitter_name: `${this.idPrefix}-credit_submitter_name`,
        credit_submitter_link: `${this.idPrefix}-credit_submitter_link`
      };
    },
    canSubmit() {
      if (!this.artForm.credit_artist_name) {
        return false;
      }
      if (
        !this.artForm.credit_artist_link.href ||
        !this.artForm.credit_artist_link.href.match(/.+\..+/)
      ) {
        return false;
      }
      if (!this.artForm.credit_artist_details) {
        return false;
      }

      return true;
    }
  },
  methods: {
    focus() {
      if (this.$refs.artistName) {
        this.$refs.artistName.focus();
      }
    },
    onInputFocus(e) {
      this.$gtm.push(
        getEvent(CATEGORIES.ART_FORM, ACTIONS.INPUT_FOCUS, e.target.id)
      );
    },
    onSubmit() {
      this.$gtm.push(
        getEvent(CATEGORIES.ART_FORM, ACTIONS.FORM_SUBMIT, this.idPrefix)
      );
    }
  }
};
</script>

<style lang="sass" scoped>
.artForm
  .fade-enter-active, .fade-leave-active
    will-change: opacity
    @apply transition-opacity duration-1/2 ease-base

  .fade-enter, .fade-leave-to
    @apply opacity-0

  .inputWrapper
    &.small
      @apply italic leading-tight

    label
      @apply block

  input, textarea
    @apply w-full

    &[type="url"]:valid:not(:placeholder-shown), &[type="url"]:disabled
      @apply underline text-navy

  textarea
    scrollbar-width: thin

    &::-webkit-scrollbar
      width: 6px
      height: 6px
</style>
