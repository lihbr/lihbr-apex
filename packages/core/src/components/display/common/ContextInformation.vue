<!-- HEALTH:MID common-context-information -->
<template>
  <div class="commonContextInformation stack-5 px-5 text-center">
    <div class="stack-exception heading-giant">
      {{ title }}
    </div>
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
      default: ""
    },
    message: {
      type: String,
      default: ""
    }
  }
};
</script>
