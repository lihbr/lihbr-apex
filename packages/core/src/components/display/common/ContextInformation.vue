<!-- HEALTH:MID common-context-information -->
<template>
  <div class="commonContextInformation stack-5 px-5 text-center">
    <h2 class="stack-exception heading-giant">
      {{ title }}
    </h2>
    <h1 class="heading-h2">
      {{ message | uc_first }}
    </h1>
    <hr class="h-5 border-0 colorInherit--bg transition-bg" />
    <slot name="post" />
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: false,
      default: ""
    },
    message: {
      type: String,
      required: false,
      default: ""
    }
  }
};
</script>
