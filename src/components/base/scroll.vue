<template >
  <div class="scroll" ref="wrapper">
    <!-- 自定义滚动组件-复用 基于"better-scroll": "^1.15.1",-->
    <slot></slot>
  </div>
</template>

<script>
import BScroll from "better-scroll";

export default {
  name: "",
  props: {
    probeType: {
      type: Number,
      default: 1,
    },
    click: {
      type: Boolean,
      default: true,
    },
    data: {
      type: Array,
      default: null,
    },
    listenScroll: {
      type: Boolean, //是否要监听滚动事件
      default: false
    },
    pullup: {
      type: Boolean, //是否开启上拉刷新
      default: false
    },
    beforeScroll: {
      type: Boolean,
      default: false
    },
    refreshDelay:{
      type: Number,
      default: 20
    }
  },
  mounted() {
    setTimeout(() => {
      this._initScroll();
    }, 20);
  },
  watch:{
      data() {
        //   监听数据变化刷新
          setTimeout(() => {
              this.refresh();
          },this.refreshDelay)
      }
  },
  methods: {
    _initScroll() {
      if (!this.$refs.wrapper) {
        return;
      }
      // 初始化
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click,
      });
      // 监听滚动事件
      if(this.listenScroll) {
        let me = this;
        this.scroll.on('scroll', (pos) => {
          me.$emit('scroll', pos)
        })
      }
      // 是否上拉刷新-派发事件
      if(this.pullup) {
        this.scroll.on('scrollEnd', () => {
          if(this.scroll.y <= (this.scroll.maxScrollY + 50)) {
            this.$emit('scrollToEnd')
          }
        })
      }
      //beforeScroll
      if(this.beforeScroll) {
        this.scroll.on('beforeScrollStart', () => {
          this.$emit('beforeScroll')
        })
      }
    },
    //   代理 BScroll 的方法
    enable() {
      this.scroll && this.scroll.enable();
    },
    disable() {
      this.scroll && this.scroll.disable();
    },
    refresh() {
      this.scroll && this.scroll.refresh();
    },
    scrollTo() {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments);
    },
    scrollToElement() {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/style/mixin.scss";
</style>