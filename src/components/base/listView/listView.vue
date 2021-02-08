<template >
  <!-- 歌手列表组件 可通用 -->
  <Scroll
    class="list-view"
    :data="data"
    ref="listview"
    :listenScroll="listenScroll"
    @scroll="scroll"
    :probeType="probeType"
  >
    <ul>
      <li
        v-for="group in data"
        class="list-group"
        :key="group.id"
        ref="listGroup"
      >
        <h2 class="list-group-title">{{ group.title }}</h2>
        <ul>
          <li
           @click="selectItem(item)"
            class="list-group-item"
            v-for="(item, index) in group.items"
            :key="index"
          >
            <img v-lazy="item.avatar" alt="" class="avatar" />
            <span class="name">{{ item.name }}</span>
          </li>
        </ul>
      </li>
    </ul>
    <!-- a-z 引导条 -->
    <div
      class="list-shortcut"
      @touchstart="onShortcutTouchStart"
      @touchmove.stop.prevent="onShortcutTouchMove"
    >
      <ul>
        <li
          class="item"
          v-for="(item, index) in shortcutList"
          :key="index"
          :data-index="index"
          :class="{ current: currentIndex === index }"
        >
          {{ item }}
        </li>
      </ul>
    </div>
    <!-- 固定标题栏 -->
    <div class="list-fixed" v-show="fixedTitle" ref="fixed">
      <h1 class="fixed-title">{{ fixedTitle }}</h1>
    </div>
    <!-- loading 区域 -->
    <div class="loading-container" v-show="!data.length">
      <Loading />
    </div>
  </Scroll>
</template>

<script>
// 引入 js 配置
import { getData } from "config/js/dom";
// 引入 scroll 组件
import Scroll from "components/base/scroll";
import Loading from "components/base/loading/loading";

// a-z 单个锚点的高度
const ANCHOR_HEIGHT = 18;
const TITLE_HEIGHT = 30;

export default {
  name: "",
  data() {
    return {
      scrollY: -1, //用于观测实时滚动位置
      currentIndex: 0, //当前位置
      diff: -1, //固定栏滚动差
    };
  },
  props: {
    data: {
      type: Array,
      default: [],
    },
  },
  created() {
    //  onShortcutTouchMove 方法的值，用于记录，不需要监听
    this.touch = {};
    // 监听滚动事件
    this.listenScroll = true;
    // 用于计算高度
    this.listHeight = [];
    // scroll 组件值，用于改变probeType
    this.probeType = 3;
  },
  computed: {
    shortcutList() {
      // 获取a-z数组
      return this.data.map((group) => {
        return group.title.substr(0, 1);
      });
    },
    fixedTitle() {
      // 固定标题栏
      if (this.scrollY > 0) {
        return "";
      }
      return this.data[this.currentIndex]
        ? this.data[this.currentIndex].title
        : "";
    },
  },
  components: {
    Scroll,
    Loading,
  },
  watch: {
    data() {
      //   data发生改变的时候计算高度，延迟20毫秒
      setTimeout(() => {
        this._calculateHeight();
      }, 20);
    },
    scrollY(newY) {
      const listHeight = this.listHeight;
      // 当滚动到顶部，newY>0
      if (newY > 0) {
        this.currentIndex = 0;
        return;
      }
      // 在中间部分滚动
      for (let i = 0; i < listHeight.length - 1; i++) {
        let height1 = listHeight[i];
        let height2 = listHeight[i + 1];
        if (-newY >= height1 && -newY < height2) {
          this.currentIndex = i;
          this.diff = height2 + newY;
          return;
        }
      }
      // 滚到底部且-newY大于最后一个元素的上限
      this.currentIndex = listHeight.length - 2;
    },
    diff(newVal) {
      // 控制固定栏移动
      let fixedTop =
        newVal > 0 && newVal < TITLE_HEIGHT ? newVal - TITLE_HEIGHT : 0;
      if (this.fixedTop === fixedTop) {
        return;
      }
      this.fixedTop = fixedTop;
      this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`;
    },
  },
  methods: {
    onShortcutTouchStart(e) {
      // 点击跳转到相对应的列表
      let anchorIndex = getData(e.target, "index");
      //   记录第一次触碰位置-用于 onShortcutTouchMove 计算--在 created中创建
      let firstTouch = e.touches[0];
      this.touch.y1 = firstTouch.pageY;
      this.touch.anchorIndex = anchorIndex;
      this._scrollTo(anchorIndex);
    },
    onShortcutTouchMove(e) {
      // 手机滑动跳转到相对于的列表
      let firstTouch = e.touches[0];
      this.touch.y2 = firstTouch.pageY;
      let delta = ((this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT) | 0;
      let anchorIndex = parseInt(this.touch.anchorIndex) + delta;
      this._scrollTo(anchorIndex);
    },
    scroll(pos) {
      // 监听滚动方法，scroll组件派发
      this.scrollY = pos.y;
    },
    _scrollTo(index) {
      // 抽离出的滚动方法
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0);
    },
    _calculateHeight() {
      // 计算高度
      this.listHeight = [];
      const list = this.$refs.listGroup;
      let height = 0;
      this.listHeight.push(height);
      for (let i = 0; i < list.length; i++) {
        let item = list[i];
        height += item.clientHeight;
        this.listHeight.push(height);
      }
    },
    selectItem(item){
      // 派发 selectItem方法
      this.$emit('select', item)
    },
    refresh(){
      // 暴露 refresh 接口供 singer 组件使用
      this.$refs.listview.refresh();
    }
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/style/mixin.scss";

.list-view {
  position: relative;
  @include wh(100%, 100%);
  overflow: hidden;
  background: $color-background;
  .list-group {
    padding-bottom: 0.6rem;
    .list-group-title {
      height: 0.6rem;
      line-height: 0.6rem;
      padding-left: 0.4rem;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-highlight-background;
    }
    .list-group-item {
      display: flex;
      align-items: center;
      padding: 0.4rem 0 0 0.6rem;
      .avatar {
        @include wh(1rem, 1rem);
        border-radius: 50%;
      }
      .name {
        margin-left: 0.4rem;
        color: $color-text-l;
        font-size: $font-size-medium;
      }
    }
  }
  // a-z 引导条
  .list-shortcut {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 0;
    z-index: 30;
    width: 0.4rem;
    padding: 0.4rem 0;
    border-radius: 0.2rem;
    text-align: center;
    background: $color-background-d;
    font-family: Helvetica;
    .item {
      padding: 0.06rem;
      line-height: 1;
      color: $color-text-l;
      font-size: $font-size-small;
    }
    // 动态样式
    .current {
      color: $color-theme;
    }
  }
  //   固定标题栏
  .list-fixed {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    .fixed-title {
      line-height: 0.6rem;
      height: 0.6rem;
      padding-left: 0.4rem;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-highlight-background;
    }
  }
  //   loading
  .loading-container {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>