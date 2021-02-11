<template >
  <transition name="list-fade">
    <div class="playlist" v-show="showFlag" @click="hide">
      <div class="list-wrapper" @click.stop>
        <!-- 头部 -->
        <div class="list-header">
          <h1 class="title">
            <i class="icon" :class="iconMode" @click="changeMode"></i>
            <span class="text">{{ modeText }}</span>
            <span class="clear" @click="showConfirm">
              <i class="icon-clear"></i>
            </span>
          </h1>
        </div>
        <!-- 内容区 -->
        <Scroll :refreshDelay="refreshDelay" class="list-content" ref="listContent" :data="sequenceList">
          <transition-group name="list-item" tag="ul">
            <li
              ref="listItem"
              @click="selectItem(item, index)"
              class="item"
              v-for="(item, index) in sequenceList"
              :key="index"
            >
              <i class="current" :class="getCurrentIcon(item)"></i>
              <span class="text">{{ item.name }}</span>
              <span class="like" @click.stop="toggleFavorite(item)">
                <i :class="getFavoriteIcon(item)"></i>
              </span>
              <span  class="delete" @click.stop="deleteOne(item)">
                <i class="icon-delete"></i>
              </span>
            </li>
          </transition-group>
        </Scroll>
        <!-- 添加歌曲 -->
        <div class="list-operate">
          <div class="add" @click="addSong">
            <i class="icon-add"></i>
            <span class="text">添加歌曲到队列</span>
          </div>
        </div>
        <!-- 关闭 -->
        <div class="list-close" @click="hide">
          <span>关闭</span>
        </div>
      </div>
      <!-- 弹窗提示 -->
      <Confirm
        @confirm="confirmClear"
        text="是否清空播放列表"
        ref="confirm"
        confirmBtnText="清空"
      />
      <!-- 添加歌曲组件 -->
      <AddSong ref="addSong"  />
    </div>
  </transition>
</template>

<script>
// js配置
import { mapGetters, mapMutations, mapActions } from "vuex";
import { playMode } from "config/common/config";
import { playerMixin } from "config/js/mixin";
// 组件
import Scroll from "base/scroll";
import Confirm from "base/confirm/confirm";
import AddSong from "common/add-song/add-song"

export default {
  mixins: [playerMixin],
  name: "",
  data() {
    return {
      showFlag: false,
      refreshDelay:100
    };
  },
  components: {
    Scroll,
    Confirm,
    AddSong
  },
  computed: {
    ...mapGetters(["sequenceList", "currentSong", "playlist", "mode"]),
    modeText() {
      return this.mode === playMode.sequence
        ? "顺序播放"
        : this.mode === playMode.random
        ? "随机播放"
        : "单曲循序";
    },
  },
  watch: {
    currentSong(newSong, oldSong) {
      if (!this.showFlag || newSong.id === oldSong.id) {
        return;
      }
      setTimeout(() => {
        this.scrollToCurrent(newSong);
      }, 20);
    },
  },
  methods: {
    ...mapActions(["deleteSong", "deleteSongList"]),
    show() {
      this.showFlag = true;
      setTimeout(() => {
        this.$refs.listContent.refresh();
      }, 20);
    },
    hide() {
      this.showFlag = false;
    },
    getCurrentIcon(item) {
      // 动态样式 列表元素播放icon
      if (this.currentSong.id === item.id) {
        return "icon-play";
      } else {
        return "";
      }
    },
    selectItem(item, index) {
      // 播放点击歌曲
      if (this.mode === playMode.random) {
        index = this.playlist.findIndex((song) => {
          return song.id === item.id;
        });
      }
      this.SET_CURRENT_INDEX(index);
      this.SET_PLAYING_STATE(true);
    },
    scrollToCurrent(current) {
      // 播放歌曲滚动到当前列表
      const index = this.sequenceList.findIndex((song) => {
        return current.id === song.id;
      });
      this.$refs.listContent.scrollToElement(this.$refs.listItem[index], 300);
    },
    deleteOne(item) {
      // 删除一个
      this.deleteSong(item);
      if (!this.playlist.length) {
        this.hide();
      }
    },
    showConfirm() {
      // 弹窗
      this.$refs.confirm.show();
    },
    confirmClear() {
      // 清空播放列表
      this.deleteSongList();
      this.$refs.confirm.hide();
    },
    // 添加歌曲
    addSong(){
        this.$refs.addSong.show();
    }
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/style/mixin.scss";

.playlist {
  @include fixed-full-screen;
  z-index: 200;
  background: $color-background-d;
  .list-wrapper {
    position: absolute;
    left: 0;
    width: 100%;
    bottom: 0;
    background: $color-highlight-background;
    // 头部
    .list-header {
      position: relative;
      padding: 0.4rem 0.6rem 0.2rem 0.4rem;
      .title {
        display: flex;
        align-items: center;
        .icon {
          margin-right: 0.2rem;
          font-size: 0.6rem;
          color: $color-theme-d;
        }
        .text {
          flex: 1;
          font-size: $font-size-medium;
          color: $color-text-l;
        }
        .clear {
          @include extend-click();
          .icon-clear {
            font-size: $font-size-medium;
            color: $color-text-d;
          }
        }
      }
    }
    // 内容区
    .list-content {
      max-height: 4.8rem;
      overflow: hidden;
      // list-group
      .list-item-enter-active,
      .list-leave-active {
        transition: all 0.2s;
      }
      .list-item-enter,
      .list-leave-to {
        height: 0;
      }
      .item {
        display: flex;
        align-items: center;
        height: 0.8rem;
        padding: 0 0.6rem 0 0.4rem;
        overflow: hidden;
        .current {
          flex: 0 0 0.4rem;
          width: 0.4rem;
          font-size: $font-size-small;
          color: $color-theme-d;
        }
        .text {
          flex: 1;
          @include ellipsis;
          font-size: $font-size-medium;
          color: $color-text-l;
        }
        .like {
          @include extend-click();
          margin-right: 0.3rem;
          font-size: $font-size-small;
          color: $color-theme;
          .icon-not-favorite {
            color: $color-sub-theme;
          }
        }
        .delete {
          @include extend-click();
          font-size: $font-size-small;
          color: $color-theme;
          .icon-delete {
          }
        }
      }
    }
    // 添加歌曲
    .list-operate {
      width: 2.8rem;
      margin: 0.4rem auto 0.6rem auto;
      .add {
        display: flex;
        align-items: center;
        padding: 0.16rem 0.32rem;
        border: 1px solid $color-text-l;
        border-radius: 2rem;
        color: $color-text-l;
        .icon-add {
          margin-right: 0.1rem;
          font-size: $font-size-small-s;
        }
        .text {
          font-size: $font-size-small;
        }
      }
    }
    //关闭
    .list-close {
      text-align: center;
      line-height: 1rem;
      background: $color-background;
      font-size: $font-size-medium-x;
      color: $color-text-l;
    }
  }
}
// transform
.list-fade-enter-active,
.list-fade-leave-active {
  transition: opacity 0.3s;
  .list-wrapper {
    transition: all 0.3s;
  }
}
.list-fade-enter,
.list-fade-leave-to {
  opacity: 0;
  .list-wrapper {
    transform: translate3d(0, 100%, 0);
  }
}
// list-group
.list-item-enter-active,
.list-leave-active {
  transition: all 0.2s;
}
.list-item-enter,
.list-leave-to {
  height: 0;
}
</style>