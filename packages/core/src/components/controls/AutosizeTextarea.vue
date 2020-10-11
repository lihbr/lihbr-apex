<!-- HEALTH:HIGH autosize-textarea -->
<template>
  <textarea
    v-model="cValue"
    class="autosizeTextarea"
    :style="computedStyles"
    @focus="resize"
  >
    <slot />
  </textarea>
</template>

<script>
import throttle from "lodash/throttle";

export default {
  props: {
    value: {
      type: String,
      default: ""
    },
    autosize: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      cValue: "",
      height: "auto"
    };
  },
  computed: {
    computedStyles() {
      if (!this.autosize) {
        return {};
      } else {
        return {
          resize: "none",
          height: this.height
        };
      }
    }
  },
  watch: {
    value() {
      this.cValue = this.value;
    },
    cValue() {
      this.$nextTick(this.resize);
      this.$emit("input", this.cValue);
    },
    autosize() {
      if (this.autosize) {
        this.resize();
      }
    }
  },
  created() {
    this.val = this.value;
  },
  mounted() {
    this.resize();

    this.$options._resizeEvent = throttle(this.resize.bind(this), 200);
    window.addEventListener("resize", this.$options._resizeEvent);
  },
  destroyed() {
    window.removeEventListener("resize", this.$options._resizeEvent);
  },
  methods: {
    resize() {
      this.height = "auto";
      this.$nextTick(() => {
        this.height = `${this.$el.scrollHeight}px`;
      });
    }
  }
};
</script>
