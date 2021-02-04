<template >
  <div class="slider" ref="slider">
    <!-- 轮播图组件 -->
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <span
        class="dot"
        v-for="(item, index) in dots"
        :key="index"
        :class="{ active: currentPageIndex === index }"
      ></span>
    </div>
  </div>
</template>

<script>
// 引入bscroll 添加 class 方法
import BScroll from "better-scroll";
import { addClass } from "config/js/dom.js";

export default {
  name: "MSlider",
  data() {
    return {
      dots: [], //轮播点
      currentPageIndex: 0, //控制active样式
    };
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
      this._initDots();
      this._initSlider();

      if (this.autoPlay) {
        this._play();
      }
    }, 20);

    window.addEventListener("resize", () => {
      if (!this.slider || !this.slider.enabled) {
        return;
      }
      clearTimeout(this.resizeTimer);
      this.resizeTimer = setTimeout(() => {
        if (this.slider.isInTransition) {
          this._onScrollEnd();
        } else {
          if (this.autoPlay) {
            this._play();
          }
        }
        this.refresh();
      }, 60);
    });
  },
  methods: {
    refresh() {
      if (this.slider) {
        this._setSliderWidth(true);
        this.slider.refresh();
      }
    },
    _setSliderWidth(isResize) {
      this.children = this.$refs.sliderGroup.children;

      let width = 0;
      let sliderWidth = this.$refs.slider.clientWidth;
      for (let i = 0; i < this.children.length; i++) {
        let child = this.children[i];
        addClass(child, "slider-item");

        child.style.width = sliderWidth + "px";
        width += sliderWidth;
      }
      if (this.loop && !isResize) {
        width += 2 * sliderWidth;
      }
      this.$refs.sliderGroup.style.width = width + "px";
    },
    _initSlider() {
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: {
          loop: this.loop,
          threshold: 0.3,
          speed: 400,
        },
        click: true
      });

      this.slider.on("scrollEnd", this._onScrollEnd);

      this.slider.on('touchend', () => {
        if (this.autoPlay) {
          this._play()
        }
      })

      this.slider.on("beforeScrollStart", () => {
        if (this.autoPlay) {
          clearTimeout(this.timer);
        }
      });
    },
    _onScrollEnd() {
      let pageIndex = this.slider.getCurrentPage().pageX;
      this.currentPageIndex = pageIndex;
      if (this.autoPlay) {
        this._play();
      }
    },
    _initDots() {
      this.dots = new Array(this.children.length);
    },
    _play() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.slider.next();
      }, this.interval);
    },
  },
  destroyed(){
    clearTimeout(this.timer)
  }
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
    .slider-item {
      float: left;
      box-sizing: border-box;
      overflow: hidden;
      text-align: center;
      a {
        display: block;
        width: 100%;
        overflow: hidden;
        text-decoration: none;
      }
      img {
        display: block;
        width: 100%;
      }
    }
  }
}
.dots {
  position: absolute;
  right: 0;
  left: 0;
  bottom: 0.21rem;
  transform: translateZ(1px);
  text-align: center;
  font-size: 0;
  .dot {
    display: inline-block;
    margin: 0 0.1rem;
    @include wh(0.18rem, 0.18rem);
    border-radius: 50%;
    background: $color-text-l;
  }
  .active {
    width: 0.4rem;
    border-radius: 0.1rem;
    background: $color-text-ll;
  }
}
</style>