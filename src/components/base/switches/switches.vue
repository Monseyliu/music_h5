<template >
  <div class="switches">
    <li
      class="switch-item"
      v-for="(item, index) in switches"
      :key="index"
      :class="{ 'active': currentIndex === index }"
      @click="switchItem(index)"
    >
      <span>{{ item }}</span>
    </li>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {};
  },
  props: {
    switches: {
      type: Array,
      default: [],
    },
    currentIndex: {
      type: Number,
      default: 0,
    },
  },
  methods: {
    switchItem(index) {
      this.$emit("switch", index);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/style/mixin.scss";

.switches {
  display: flex;
  align-items: center;
  width: 4.8rem;
  margin: 0 auto;
  border: 1px solid $color-highlight-background;
  border-radius: 0.1rem;
  .switch-item {
    flex: 1;
    padding: 0.16rem;
    text-align: center;
    font-size: $font-size-medium;
    color: $color-text-d;
  }
  .active {
    background: $color-highlight-background;
    color: $color-text;
  }
}
</style>