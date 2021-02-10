<template >
  <transition name="slide">
    <div class="add-song" v-show="showFlag" @click.stop>
      <!-- 头部 -->
      <div class="header">
        <h1 class="title">添加歌曲到列表</h1>
        <div class="close" @click="hide">
          <i class="icon-close"></i>
        </div>
      </div>
      <!-- 内容 -->
      <div class="search-box-wrapper">
        <SearchBox
          ref="searchBox"
          placeholder="搜索歌曲"
          @query="onQueryChange"
        />
        <!-- 展示区 -->
        <div class="list-wrapp">
          <!-- 播放历史 -->
          <Scroll
            v-if="currentIndex === 0"
            :data="playHistory"
            class="list-scroll"
            ref="songList"
          >
            <div class="list-inner">
              <SongList
                :songs="playHistory"
                class="list-scroll"
                @select="selectSong"
              />
            </div>
          </Scroll>
          <!-- 搜索历史 -->
          <Scroll
            class="list-scroll"
            v-if="currentIndex === 1"
            :data="searchHistory"
            ref="searchList"
            :refreshDelay="refreshDelay"
          >
            <div class="list-inner">
              <SearchList
                @delete="deleteSearchHistory"
                @select="addQuery"
                :searches="searchHistory"
                v-show="!query"
              />
            </div>
          </Scroll>
        </div>
      </div>
      <!-- 切换组件 -->
      <div class="shortcut" v-show="!query">
        <Switches
          :currentIndex="currentIndex"
          :switches="switches"
          @switch="switchItem"
        />
      </div>
      <!-- 搜索结果 -->
      <div class="search-result" v-show="query">
        <Suggest
          :query="query"
          :showSinger="showSinger"
          @listScroll="blurInput"
          @select="selectSuggest"
        />
      </div>
      <!-- 顶部提示框 -->
      <TopTip ref="topTip">
        <div class="tip-title">
          <i class="icon-ok"></i>
          <span class="text">1首歌曲已经添加到播放列表</span>
        </div>
      </TopTip>
    </div>
  </transition>
</template>

<script>
// js配置
import { searchMixin } from "config/js/mixin";
import { mapGetters, mapActions } from "vuex";
import Song from "config/js/song";
// 组件
import SearchBox from "base/search-box/search-box";
import Suggest from "common/suggest/suggest";
import Switches from "base/switches/switches";
import Scroll from "base/scroll";
import SongList from "base/song-list/song-list";
import SearchList from "base/search-list/search-list";
import TopTip from "base/top-tip/top-tip";

export default {
  mixins: [searchMixin],
  name: "",
  data() {
    return {
      showFlag: false, //控制显示
      query: "",
      showSinger: false,
      currentIndex: 0,
      switches: ["最近播放", "搜索历史"],
      refreshDelay: 100
    };
  },
  components: {
    SearchBox,
    Suggest,
    Switches,
    Scroll,
    SongList,
    SearchList,
    TopTip,
  },
  computed: {
    ...mapGetters(["playHistory"]),
  },
  methods: {
    ...mapActions(["insertSong"]),
    show() {
      this.showFlag = true;
      setTimeout(() => {
        if (this.currentIndex === 0) {
          this.$refs.songList.refresh();
        } else {
          this.$refs.searchList.refresh();
        }
      }, 20);
    },
    hide() {
      this.showFlag = false;
    },
    //歌曲搜索
    onQueryChange(query) {
      this.query = query;
    },
    // 搜索结果
    selectSuggest() {
      this.saveSearch();
      this.showTip();
    },
    switchItem(index) {
      // 切换
      this.currentIndex = index;
    },
    selectSong(song, index) {
      if (index !== 0) {
        //   引入Song 创建歌曲对象
        this.insertSong(new Song(song));
        this.showTip();
      }
    },
    showTip() {
      this.$refs.topTip.show();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/style/mixin.scss";
.add-song {
  @include fixed-full-screen;
  z-index: 200;
  background: $color-background;
  // 头部
  .header {
    position: relative;
    height: 0.88rem;
    text-align: center;
    .title {
      line-height: 0.88rem;
      font-size: $font-size-large;
      color: $color-text;
    }
    .close {
      position: absolute;
      top: 0;
      right: 0.16rem;
      .icon-close {
        display: block;
        padding: 0.24rem;
        font-size: 0.4rem;
        color: $color-theme;
      }
    }
  }
  // 内容
  .search-box-wrapper {
    margin: 0.4rem;
    .list-wrapp {
      position: absolute;
      top: 3.3rem;
      bottom: 0;
      width: 100%;
      .list-scroll {
        height: 100%;
        overflow: hidden;
        .list-inner {
          padding: 0.4rem 0.6rem;
        }
      }
    }
  }
  // 切换
  .shortcut {
  }
  // 搜索结果
  .search-result {
    position: fixed;
    top: 2.48rem;
    bottom: 0;
    width: 100%;
  }
  //   顶部提示
  .tip-title {
    text-align: center;
    padding: 0.36rem 0;
    font-size: 0;
    .icon-ok {
      font-size: $font-size-medium;
      color: $color-theme;
      margin-right: 0.08rem;
    }
    .text {
      font-size: $font-size-medium;
      color: $color-text;
    }
  }
}

// transition
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s;
}
.slide-enter,
.slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>