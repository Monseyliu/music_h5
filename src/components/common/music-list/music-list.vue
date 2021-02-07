<template >
  <!-- 歌曲列表 全局共用组件 -->
  <div class="music-list">
    <!-- 头部返回按钮 -->
    <div class="back" @click="back">
      <i class="iconfont icon-back"></i>
    </div>
    <!-- 列表 -->
    <h1 class="title" v-html="title"></h1>
    <!-- 背景图 -->
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <!-- 播放按钮 -->
      <div class="play-wrapper" >
        <div class="play" v-show="songs.length > 0" ref="playBtn" @click="random">
          <i class="iconfont icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <!-- 歌曲列表移动，跟着移动层 -->
    <div class="bg-layer" ref="layer"></div>
    <!-- 歌曲列表 可滚动 -->
    <Scroll
      :data="songs"
      :probe-type="probeType"
      :listen-scroll="listenScroll"
      @scroll="scroll"
      class="list"
      ref="list"
    >
      <div class="song-list-wrapper">
        <SongList :songs="songs" @select="selectItem" />
      </div>
      <!-- loading 组件 -->
      <div class="loading-container" v-show="!songs.length">
        <Loading />
      </div>
    </Scroll>
  </div>
</template>

<script>
// 引入 scroll 和 song-list loading 组件
import Scroll from "components/base/scroll";
import Loading from "components/base/loading/loading";
import SongList from "components/base/song-list/song-list";
// 引入 js  配置
import { prefixStyle } from "config/js/dom";
import { mapActions } from "vuex";

// 预留顶部固定偏移量
const RESERVED_HEIGHT = 40;
// 根据 prefixStyle 动态设置 transform
const transform = prefixStyle("transform");
const backdrop = prefixStyle("backdrop-filter");

export default {
  name: "",
  props: {
    bgImage: {
      type: String,
      default: "",
    },
    songs: {
      type: Array,
      default: [],
    },
    title: {
      type: String,
      deafult: "",
    },
  },
  data() {
    return {
      scrollY: 0, //计算Y方向的变化
    };
  },
  mounted() {
    //   动态计算 list 高度
    this.imageHeight = this.$refs.bgImage.clientHeight;
    this.minTransalteY = -this.imageHeight + RESERVED_HEIGHT;
    this.$refs.list.$el.style.top = `${this.imageHeight}px`;
  },
  created() {
    this.probeType = 3;
    this.listenScroll = true;
  },
  computed: {
    bgStyle() {
      return `background-image: url(${this.bgImage})`;
    },
  },
  methods: {
    ...mapActions(['selectPlay', 'randomPlay']),
    scroll(pos) {
      //   监听歌单列表滚动事件
      this.scrollY = pos.y;
    },
    back() {
      this.$router.back();
    },
    selectItem(item, index) {
      // 接收 song-list 派发过来的点击事件-设置相关列表和播放歌曲-同时多事件，使用actions
      this.selectPlay({
        list: this.songs,
        index: index,
      })
    },
    random(){
      // 随机播放
      this.randomPlay({
        list: this.songs
      })
    }
  },
  watch: {
    scrollY(newVal) {
      //   监听 Y方向变化并赋值
      let translateY = Math.max(this.minTransalteY, newVal);
      //   计算歌词和图片的z-index 控制显示
      let zIndex = 0;
      //   控制缩放
      let scale = 1;
      //   控制高斯模糊效果
      let blur = 0;
      //   设置 layer样式
      this.$refs.layer.style[transform] = `translate3d(0, ${translateY}px, 0)`;
      //   设置缩放 percent 并赋值
      const percent = Math.abs(newVal / this.imageHeight);
      if (newVal > 0) {
        scale = 1 + percent;
        zIndex = 10;
      } else {
        //   设置最大模糊 20
        blur = Math.min(20 * percent, 20);
      }
      //   为 IOS手机设置高斯模糊
      this.$refs.filter.style[backdrop] = `blur(${blur}px)`;
      // 设置 bgimage 缩放比例样式
      this.$refs.bgImage.style[transform] = `scale(${scale})`;
      //   当滚动到顶部预设位置的时候调整样式，覆盖歌单溢出的问题
      if (newVal < this.minTransalteY) {
        zIndex = 10;
        this.$refs.bgImage.style.paddingTop = 0;
        this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`;
        this.$refs.playBtn.style.display = "none";
      } else {
        this.$refs.bgImage.style.paddingTop = "70%";
        this.$refs.bgImage.style.height = 0;
        this.$refs.playBtn.style.display = "";
      }
      this.$refs.bgImage.style.zIndex = zIndex;
    },
  },
  components: {
    Scroll,
    SongList,
    Loading,
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/style/mixin.scss";

.music-list {
  @include fixed-full-screen;
  z-index: 100;
  background: $color-background;
  // 返回按钮
  .back {
    position: absolute;
    top: 0;
    left: 0.11rem;
    z-index: 50;
    .icon-back {
      display: block;
      padding: 0.2rem;
      font-size: $font-size-large-x;
      color: $color-theme;
    }
  }
  //   标题
  .title {
    position: absolute;
    top: 0;
    left: 10%;
    z-index: 40;
    width: 80%;
    text-align: center;
    line-height: 0.8rem;
    font-size: $font-size-large;
    color: $color-text;
    @include ellipsis;
  }
  //   背景图
  .bg-image {
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 70%;
    transform-origin: top;
    background-size: cover;
    .filter {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(7, 17, 27, 0.4);
    }
    // 播放按钮
    .play-wrapper {
      position: absolute;
      bottom: 0.4rem;
      z-index: 50;
      width: 100%;
      .play {
        box-sizing: border-box;
        width: 2.7rem;
        padding: 0.14rem 0;
        margin: 0 auto;
        text-align: center;
        border: 1px solid $color-theme;
        color: $color-theme;
        border-radius: 2rem;
        font-size: 0;
        .icon-play {
          display: inline-block;
          vertical-align: middle;
          margin-right: 0.12rem;
          font-size: $font-size-medium-x;
        }
        .text {
          display: inline-block;
          vertical-align: middle;
          font-size: $font-size-small;
        }
      }
    }
  }
  //   歌曲列表移动，跟着移动层
  .bg-layer {
    position: relative;
    height: 100%;
    background: $color-background;
  }
  //   歌曲列表
  .list {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    background: $color-background;
    .song-list-wrapper {
      padding: 0.4rem 0.6rem;
    }
    // loading
    .loading-container {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>