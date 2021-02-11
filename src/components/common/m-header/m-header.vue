<template >
  <div class="m-header">
    <div class="icon"></div>
    <h1 class="text">Happy Music</h1>
    <!-- 用户中心 -->
    <router-link to="/user" class="mine" tag="div">
      <i class="icon-mine"></i>
    </router-link>
  </div>
</template>

<script>
export default {
  name: "MHeader",
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
@import "~@/assets/style/mixin.scss";
.m-header {
  position: relative;
  height: $headHeight;
  text-align: center;
  color: $color-theme;
  font-size: 0;
  .icon {
    display: inline-block;
    @include bg-image("logo");
    vertical-align: top;
    margin-top: 0.16rem;
    @include wh(0.6rem, 0.6rem);
    background-size: cover;
  }
  .text {
    display: inline-block;
    vertical-align: top;
    line-height: $headHeight;
    font-size: $font-size-large;
    margin-left: 0.2rem;
  }
  .mine {
    position: absolute;
    top: 0;
    right: 0;
    .icon-mine {
      display: block;
      padding: 12px;
      font-size: 20px;
      color: $color-theme;
    }
  }
}
</style>