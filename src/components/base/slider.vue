<template >
  <div class="slider" ref="slider">
    <!-- 轮播图组件 -->
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots"></div>
  </div>
</template>

<script>
// 引入bscroll 添加 class 方法
import BScroll from "better-scroll";
import { addClass } from "config/js/dom.js";

export default {
  name: "MSlider",
  data() {
    return {};
  },
  props: {
    loop: {
      //循环轮播
      type: Boolean,
      default: true,
    },
    autoPlay: {
      //自动轮播
      type: Boolean,
      default: true,
    },
    interval: {
      //时间间隔
      type: Number,
      default: 4000,
    },
  },
  mounted() {
    setTimeout(() => {
      this._setSliderWidth();
      this._initSlider();
    }, 20);
  },
  methods: {
    _setSliderWidth() {
      // 设置宽度
      this.children = this.$refs.sliderGroup.children;
      let width = 0;
      let sliderWidth = this.$refs.slider.clientWidth;
      for (let i = 0; i < this.children.length; i++) {
        let child = this.children[i];
      }
    },
    _initSlider() {
      // 初始化slider
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/style/mixin.scss";
.slider {
  min-height: 1px;
  .slider-group {
    position: relative;
    overflow: hidden;
    white-space: nowrap;
  }
  .dots {
    position: absolute;
    right: 0;
    left: 0;
    bottom: 0.21rem;
    transform: translateZ(1px);
    text-align: center;
    font-size: 0;
  }
}
</style>