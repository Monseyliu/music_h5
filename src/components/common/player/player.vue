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
        <div class="middle" 
            @touchstart.prevent="middleTouchStart"
            @touchmove.prevent="middleTouchMove"
            @touchend="middleTouchEnd"
        >
          <!-- 旋转唱片 -->
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdCls">
                <img class="image" :src="currentSong.image" />
              </div>
            </div>
            <!-- 当前播放歌词 -->
            <div class="playing-lyric-wrapper">
                <div class="playing-lyric">{{playingLyric}}</div>
            </div>
          </div>
          <!-- 歌词 -->
          <Scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p
                  class="text"
                  ref="lyricLine"
                  v-for="(item, index) in currentLyric.lines"
                  :key="index"
                  :class="{'current': currentLineNum === index}"
                >{{item.txt}}</p>
              </div>
            </div>
          </Scroll>
        </div>
        <!-- 底部 -->
        <div class="bottom">
            <!-- 歌词切换显示的点 -->
            <div class="dot-wrapper">
                <span class="dot" :class="{'active': currentShow === 'cd' }"></span>
                <span class="dot" :class="{'active': currentShow === 'lyric' }"></span>
            </div>
          <!-- 歌曲进度条 -->
          <div class="progress-wrapper">
            <span class="time time-l">{{ currentTime }}</span>
            <div class="progress-bar-wrapper">
              <!-- 进度条组件 -->
              <ProgressBar
                :percent="percent"
                @percentChange="onProgressBarChange"
              />
            </div>
            <span class="time time-r">{{ format(currentSong.duration) }}</span>
          </div>
          <div class="operators">
            <!-- 左侧 -->
            <div class="icon i-left" @click="changeMode">
              <i :class="iconMode"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i @click="prev" class="iconfont icon-prev"></i>
            </div>
            <!-- 中间 -->
            <div class="icon i-center" :class="disableCls">
              <i @click="togglePlaying" class="iconfont" :class="playIcon"></i>
            </div>
            <!-- 右侧 -->
            <div class="icon i-right" :class="disableCls">
              <i
                @click="next"
                :class="disableCls"
                class="iconfont icon-next"
              ></i>
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
            <img
              :class="cdCls"
              width="40"
              height="40"
              :src="currentSong.image"
            />
          </div>
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <!-- 右侧 -->
        <div class="control">
          <!-- 原型进度条 -->
          <ProgressCircle :radius="radius" :percent="percent">
            <i
              :class="miniIcon"
              class="icon-mini"
              @click.stop="togglePlaying"
            ></i>
          </ProgressCircle>
        </div>
        <div class="control">
          <i class="iconfont icon-playlist"></i>
        </div>
      </div>
    </transition>
    <!-- 音乐播放部分 -->
    <audio
      :src="currentSong.url"
      ref="audio"
      @canplay="ready"
      @error="erro"
      @timeupdate="updateTime"
      @ended="end"
    ></audio>
  </div>
</template>

<script>
// 引入 vuex js配置 相关数据
import { mapGetters, mapMutations } from "vuex";
import animations from "create-keyframe-animation";
import { prefixStyle } from "config/js/dom";
import { playMode } from "config/common/config";
import { shuffle } from "config/js/util";
// 歌词处理三方库
import Lyric from "lyric-parser";
// 组件
import ProgressBar from "base/progress-bar/progress-bar";
import ProgressCircle from "base/progress-circle/progress-circle";
import Scroll from "base/scroll";

const transform = prefixStyle("transform");
const transitionDuration = prefixStyle("transitionDuration");

export default {
  name: "Player",
  data() {
    return {
      songReady: false, //控制歌曲是否可被切换
      currentTime: "00:00", //进度条时间
      percentTime: 0,
      radius: 30,
      currentLyric: null, //歌词
      currentLineNum: 0, //当前歌词所在行
      currentShow: 'cd', //歌词dot显示控制
      playingLyric: '', 
    };
  },
  components: {
    ProgressBar,
    ProgressCircle,
    Scroll
  },
  computed: {
    ...mapGetters([
      "fullScreen",
      "playlist",
      "currentSong",
      "playing",
      "currentIndex",
      "mode",
      "sequenceList",
    ]),
    playIcon() {
      // 播放/暂停 icon
      return this.playing ? "icon-pause" : "icon-play";
    },
    miniIcon() {
      return this.playing ? "icon-pause-mini" : "icon-play-mini";
    },
    cdCls() {
      // 旋转类设置
      return this.playing ? "play" : "play pause";
    },
    disableCls() {
      // 控制禁用状态样式
      return this.songReady ? "" : "disable";
    },
    percent() {
      return this.percentTime / this.currentSong.duration;
    },
    iconMode() {
      // 控制 播放模式
      return this.mode === playMode.sequence
        ? "icon-sequence"
        : this.mode === playMode.loop
        ? "icon-loop"
        : "icon-random";
    },
  },
  watch: {
    currentSong(newSong, oldSong) {
      //   监听当前歌曲的变化播放
      if (newSong.id === oldSong.id) return;
    //  清除定时器，解决歌词跳动bug
    if(this.currentLyric) {
        this.currentLyric.stop();
    }
      setTimeout(() => {
        this.$refs.audio.play();
        // 获取歌词
        this.getLyric();
      }, 1000);
    },
    playing(newPlaying) {
      // 监听播放状态
      const audio = this.$refs.audio;
      this.$nextTick(() => {
        newPlaying ? audio.play() : audio.pause();
      });
    },
  },
  created(){
    //   用于存储 touch原生事件对象
      this.touch = {}
  },
  methods: {
    ...mapMutations([
      "SET_FULL_SCREEN",
      "SET_PLAYING_STATE",
      "SET_CURRENT_INDEX",
      "SET_PLAY_MODE",
      "SET_PLAYLIST",
    ]),
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
    // 音乐播放相关
    togglePlaying() {
        if(!this.songReady) return;
      this.SET_PLAYING_STATE(!this.playing);
      if(this.currentLyric) {
          this.currentLyric.togglePlay();
      }
    },
    prev() {
      // 上一首
      if (!this.songReady) return;
      if(this.playlist.length === 1){
          this.loop();
      } else {
      let index = this.currentIndex - 1;
      if (index === -1) {
        index = this.playlist.length - 1;
      }
      this.SET_CURRENT_INDEX(index);
      if (!this.playing) {
        this.togglePlaying();
      }
      }
      this.songReady = false;
    },
    next() {
      // 下一首
      if (!this.songReady) return;
      if(this.playlist.length === 1) {
          this.loop()
      } else {
      let index = this.currentIndex + 1;
      if (index === this.playlist.length) {
        index = 0;
      }
      this.SET_CURRENT_INDEX(index);
      if (!this.playing) {
        this.togglePlaying();
      }
      }
      this.songReady = false;
    },
    ready() {
      this.songReady = true;
    },
    erro() {
      // 网络错误状态或者歌曲加载失败
      this.songReady = true;
    },
    end() {
      if (this.mode === playMode.loop) {
        this.loop();
      } else {
        this.next();
      }
    },
    loop() {
      // 单曲循序
      this.$refs.audio.currentTime = 0;
      this.$refs.audio.play();
      if(this.currentLyric) {
          this.currentLyric.seek(0);
      }
    },
    updateTime(e) {
      // 播放器时间
      this.percentTime = e.target.currentTime;
      this.currentTime = this.format(e.target.currentTime);
    },
    format(interval) {
      // 处理时间
      interval = interval | 0;
      const minute = ((interval / 60) | 0).toString().padStart(2, "0");
      const second = (interval % 60).toString().padStart(2, "0");
      return `${minute}:${second}`;
    },
    // 进度条
    onProgressBarChange(percent) {
      // 监听bar组件触发的拖动完成事件，改变百分比
      const currentTime = this.currentSong.duration * percent;
      this.$refs.audio.currentTime = currentTime
      if (!this.playing) {
        this.togglePlaying();
      }
      if(this.currentLyric){
          this.currentLyric.seek(currentTime * 1000);
      }
    },
    changeMode() {
      // 更改播放模式
      const mode = (this.mode + 1) % 3;
      this.SET_PLAY_MODE(mode);
      let list = null;
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList);
      } else {
        list = this.sequenceList;
      }
      this.resetCurrentIndex(list);
      this.SET_PLAYLIST(list);
    },
    resetCurrentIndex(list) {
      // 控制当前歌曲
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id;
      });
      this.SET_CURRENT_INDEX(index);
    },
    //歌词处理
    getLyric() {
      this.currentSong.getLyric().then((lyric) => {
        this.currentLyric = new Lyric(lyric, this.handleLyric);
        if(this.playing){
            this.currentLyric.play();
        }
      }).catch(err => {
          this.currentLyric = null;
          this.playingLyric = '';
          this.currentLineNum = 0;
      })
    },
    handleLyric({lineNum, txt}){
        if (!this.$refs.lyricLine) {
          return
        }
        this.currentLineNum = lineNum
        if (lineNum > 5) {
          let lineEl = this.$refs.lyricLine[lineNum - 5]
          this.$refs.lyricList.scrollToElement(lineEl, 1000)
        } else {
          this.$refs.lyricList.scrollTo(0, 0, 1000)
        }
        this.playingLyric = txt;
    },
    // 歌词滑动处理
    middleTouchStart(e){
        this.touch.initiated = true;
        const touch = e.touches[0];
        this.touch.startX = touch.pageX;
        this.touch.startY = touch.pageY;
    },
    middleTouchMove(e){
        if(!this.touch.initiated) return;
        const touch = e.touches[0];
        const deltaX = touch.pageX - this.touch.startX;
        const deltaY = touch.pageY - this.touch.startY;
        // 纵向滚动不支持
        if(Math.abs(deltaY) > Math.abs(deltaX)) return;
        const left = this.currentShow === 'cd' ? 0 : -window.innerWidth;
        const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX));
        this.touch.percent = Math.abs(offsetWidth/ window.innerWidth);
        this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`;
        this.$refs.lyricList.$el.style[transitionDuration] = 0;
        this.$refs.middleL.style.opacity = 1- this.touch.percent;
        this.$refs.middleL.style[transitionDuration] = 0;
    },
    middleTouchEnd(){
        let offsetWidth;
        let opacity;
        if(this.currentShow === 'cd') {
            if(this.touch.percent > 0.1) {
                offsetWidth = -window.innerWidth;
                opacity = 0;
                this.currentShow = 'lyric'
            } else {
                offsetWidth = 0;
                opacity = 1;
            }
        } else {
            if(this.touch.percent < 0.9){
                offsetWidth = 0;
                this.currentShow = 'cd';
                opacity = 1;
            } else {
                offsetWidth = -window.innerWidth;
                opacity = 0;
            }
        }
        const time = 300;
        this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`;
        this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`
         this.$refs.middleL.style.opacity = opacity;
        this.$refs.middleL.style[transitionDuration] = `${time}ms`;
    }

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
        // 当前歌词
        .playing-lyric-wrapper{
            width: 80%;
            margin: .6rem auto 0 auto;
            overflow: hidden;
            text-align: center;
            .playing-lyric{
                height: .4rem;
              line-height: .4rem;
              font-size: $font-size-medium;
              color: $color-text-l;
            }
        }
      }
      //   歌词
      .middle-r {
        display: inline-block;
        vertical-align: top;
        @include wh(100%, 100%);
        overflow: hidden;
        .lyric-wrapper {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;
          .text {
            line-height: 0.64rem;
            color: $color-text-l;
            font-size: $font-size-medium;
          }
          .current{
              color: $color-text;
          }
        }
      }
    }
    // 底部
    .bottom {
      position: absolute;
      bottom: 1rem;
      width: 100%;
    //   歌词显示控制点
    .dot-wrapper{
        text-align: center;
          font-size: 0;
       .dot{
           display: inline-block;
           vertical-align: middle;
           @include wh(.16rem, .16rem);
           margin: 0 .08rem;
           border-radius: 50%;
           background: $color-text-l;
       } 
       .active {
           width: .4rem;
           border-radius: .1rem;
           background: $color-text-ll;
       }
    }
      //   进度条
      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0 auto;
        padding: 0.2rem 0;
        .time {
          color: $color-text;
          font-size: $font-size-small;
          flex: 0 0 0.6rem;
          line-height: 0.6rem;
          width: 0.6rem;
        }
        .time-l {
          text-align: left;
        }
        .progress-bar-wrapper {
          flex: 1;
        }
        .time-r {
          text-align: right;
        }
      }
      // 操作栏
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
      .icon-mini {
        font-size: 0.62rem;
        position: absolute;
        left: 0;
        top: 0;
      }
      .icon-play-mini,
      .icon-pause-mini,
      .icon-playlist {
        font-size: 0.6rem;
        color: $color-theme-d;
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
// 控制唱片旋转
@keyframes rotate {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
.play {
  animation: rotate 20s linear infinite;
}
.pause {
  animation-play-state: paused;
}
</style>