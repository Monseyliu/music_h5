<template >
  <div class="player" v-show="playlist.length > 0">
    <!-- 播放器组件 - 正常播放器 -->
    <transition
      name="normal"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-lieave="afterLeave"
    >
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image" />
        </div>
        <!-- 顶部返回按钮 -->
        <div class="top">
          <div class="back" @click="back">
            <i class="iconfont icon-back"></i>
          </div>
          <!-- 标题 -->
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <!-- 中间 -->
        <div class="middle">
          <div class="middle-l">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd">
                <img class="image" :src="currentSong.image" />
              </div>
            </div>
          </div>
        </div>
        <!-- 底部 -->
        <div class="bottom">
          <div class="operators">
            <!-- 左侧 -->
            <div class="icon i-left">
              <i class="iconfont icon-sequence"></i>
            </div>
            <div class="icon i-left">
              <i class="iconfont icon-prev"></i>
            </div>
            <!-- 中间 -->
            <div class="icon i-center">
              <i class="iconfont icon-play"></i>
            </div>
            <!-- 右侧 -->
            <div class="icon i-right">
              <i class="iconfont icon-next"></i>
            </div>
            <div class="icon i-right">
              <i class="iconfont icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <!-- mini 播放器 -->
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <!-- 左侧 -->
        <div class="icon">
          <div class="imgWrapper">
            <img width="40" height="40" :src="currentSong.image" />
          </div>
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <!-- 右侧 -->
        <div class="control"></div>
        <div class="control">
          <i class="iconfont icon-playlist"></i>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
// 引入 vuex 相关数据
import { mapGetters, mapMutations } from "vuex";
import animations from "create-keyframe-animation";
import { prefixStyle } from "config/js/dom";

const transform = prefixStyle("transform");

export default {
  name: "Player",
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["fullScreen", "playlist", "currentSong"]),
  },
  methods: {
    ...mapMutations(["SET_FULL_SCREEN"]),
    back() {
      //   点击显示mini播放器
      this.SET_FULL_SCREEN(false);
    },
    open() {
      // mini播放器打开全屏
      this.SET_FULL_SCREEN(true);
    },
    // 动画钩子函数
    enter(el, done) {
      const { x, y, scale } = this._getPosAndScale();

      let animation = {
        0: {
          transform: `translate3d(${x}px,${y}px,0) scale(${scale})`,
        },
        60: {
          transform: `translate3d(0,0,0) scale(1.1)`,
        },
        100: {
          transform: `translate3d(0,0,0) scale(1)`,
        },
      };

      animations.registerAnimation({
        name: "move",
        animation,
        presets: {
          duration: 400,
          easing: "linear",
        },
      });

      animations.runAnimation(this.$refs.cdWrapper, "move", done);
    },
    afterEnter() {
      animations.unregisterAnimation("move");
      this.$refs.cdWrapper.style.animation = "";
    },
    leave(el, done) {
      this.$refs.cdWrapper.style.transition = "all 0.4s";
    //   const { x, y, scale } = this._getPosAndScale();
    //   this.$refs.cdWrapper.style[
    //     transform
    //   ] = `translate3d(${x}px,${y}px,0) scale(${scale})`;
      const timer = setTimeout(done, 400);
      this.$refs.cdWrapper.addEventListener("transitionend", () => {
        clearTimeout(timer);
        done();
      });
    },
    afterLeave() {
      this.$refs.cdWrapper.style.transition = "";
      this.$refs.cdWrapper.style[transform] = "";
    },
    _getPosAndScale() {
      // 计算动画钩子函数所需参数
      const targetWidth = 40;
      const paddingLeft = 40;
      const paddingBottom = 30;
      const paddingTop = 80;
      const width = window.innerWidth * 0.8;
      const scale = targetWidth / width;
      const x = -(window.innerWidth / 2 - paddingLeft);
      const y = window.innerHeight - paddingTop - width / 2 - paddingBottom;
      return {
        x,
        y,
        scale,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/style/mixin.scss";
.player {
  //  正常播放器
  .normal-player {
    @include fixed-full-screen;
    z-index: 150;
    background: $color-background;
    // 图片
    .background {
      position: absolute;
      @include wh(100%, 100%);
      top: 0;
      left: 0;
      z-index: -1;
      opacity: 0.6;
      filter: blur(0.4rem);
    }
    // 顶部
    .top {
      position: relative;
      margin-bottom: 0.5rem;
      .back {
        position: absolute;
        top: 0;
        left: 0.12rem;
        z-index: 50;
        .icon-back {
          display: block;
          padding: 0.18rem;
          font-size: $font-size-large-x;
          color: $color-theme;
          transform: rotate(-90deg);
        }
      }
      .title {
        width: 70%;
        margin: 0 auto;
        line-height: 0.8rem;
        text-align: center;
        @include ellipsis;
        font-size: $font-size-large;
        color: $color-text;
      }
      .subtitle {
        line-height: 0.4rem;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-text;
      }
    }
    // 中间
    .middle {
      position: fixed;
      width: 100%;
      top: 1.6rem;
      bottom: 3.4rem;
      white-space: nowrap;
      font-size: 0;
      .middle-l {
        position: relative;
        display: inline-block;
        vertical-align: top;
        @include wh(100%, 0);
        padding-top: 80%;
        .cd-wrapper {
          position: absolute;
          @include wh(80%, 100%);
          left: 10%;
          top: 0;
          box-sizing: border-box;
          .cd {
            @include wh(100%, 100%);
            border-radius: 50%;
            .image {
              position: absolute;
              left: 0;
              top: 0;
              @include wh(100%, 100%);
              box-sizing: border-box;
              border-radius: 50%;
              border: 10px solid rgba(255, 255, 255, 0.1);
            }
          }
        }
      }
    }
    // 底部
    .bottom {
      position: absolute;
      bottom: 1rem;
      width: 100%;
      .operators {
        display: flex;
        align-items: center;
        .icon {
          flex: 1;
          color: $color-theme;
          i {
            font-size: 0.6rem;
          }
        }
        .i-left {
          text-align: right;
        }
        .i-center {
          padding: 0 0.4rem;
          text-align: center;
          i {
            font-size: 0.8rem;
          }
        }
        .i-right {
          text-align: left;
        }
      }
    }
  }
  //  mini播放器
  .mini-player {
    display: flex;
    align-items: center;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 180;
    width: 100%;
    height: 1.2rem;
    background: $color-highlight-background;
    .icon {
      flex: 0 0 0.8rem;
      @include wh(0.8rem, 0.8rem);
      padding: 0 0.2rem 0 0.4rem;
      .imgWrapper {
        @include wh(100%, 100%);
        img {
          border-radius: 50%;
        }
      }
    }
    // 文字
    .text {
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex: 1;
      line-height: 0.4rem;
      overflow: hidden;
      .name {
        margin-bottom: 2px;
        @include ellipsis;
        font-size: $font-size-medium;
        color: $color-text;
      }
      .desc {
        @include ellipsis;
        font-size: $font-size-small;
        color: $color-text-d;
      }
    }
    .control {
      flex: 0 0 0.6rem;
      width: 0.6rem;
      padding: 0 0.2rem;
      .icon-play-mini,
      .icon-pause-mini,
      .icon-playlist {
        font-size: 0.6rem;
        color: $color-theme-d;
      }
      .icon-mini {
        font-size: 0.62rem;
        position: absolute;
        left: 0;
        top: 0;
      }
    }
  }
}
// transition 动画
.normal-enter-active,
.normal-leave-active {
  transition: all 0.4s;
  .top,
  .bottom {
    transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
  }
}
.normal-enter,
.normal-leave-to {
  opacity: 0;
  .top {
    transform: translate3d(0, -2rem, 0);
  }
  .bottom {
    transform: translate3d(0, 2rem, 0);
  }
}
.mini-enter-active,
.mini-leave-active {
  transition: all 0.4s;
}
.mini-enter,
.mini-leave-to {
  opacity: 0;
}
</style>