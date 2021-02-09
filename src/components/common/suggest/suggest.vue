<template >
  <Scroll
    class="suggest"
    :data="result"
    :pullup="pullup"
    :beforeScroll="beforeScroll"
    @scrollToEnd="searchMore"
    ref="suggest"
    @beforeScroll="listScroll"
  >
    <!-- 搜索结果框 -->
    <ul class="suggest-list">
      <li
        @click="selectItem(item)"
        class="suggest-item"
        v-for="(item, index) in result"
        :key="index"
      >
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <!-- loading组件 -->
      <Loading v-show="hasMore" />
    </ul>
    <!-- 无结果的时候 -->
    <div class="no-result-wrapper" v-show="!hasMore && !result.length">
      <NoResult title="抱歉暂无结果" />
    </div>
  </Scroll>
</template>

<script>
// js 配置
import { search } from "api/search";
import { ERR_OK } from "api/config";
import { createSong, isValidMusic, processSongsUrl } from "config/js/song";
import Singer from "config/js/singer";
import { mapMutations, mapActions } from "vuex";
// 组件
import Scroll from "base/scroll";
import Loading from "base/loading/loading";
import NoResult from "base/no-result/no-result";

const TYPE_SINGER = "singer";
const perpage = 20;

export default {
  name: "Suggest",
  data() {
    return {
      page: 1, //请求page
      result: [], //请求结果
      pullup: true, //开启上拉刷新
      hasMore: true, //是否还有更多
      beforeScroll: true,
    };
  },
  props: {
    query: {
      type: String,
      default: "",
    },
    showSinger: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    Scroll,
    Loading,
    NoResult,
  },
  watch: {
    query() {
      this.search();
    },
  },
  methods: {
    ...mapMutations(["SET_SINGER"]),
    ...mapActions(["insertSong"]),
    search() {
      //   请求检索 -init
      this.hasMore = true;
      this.page = 1;
      this.$refs.suggest.scrollTo(0, 0);
      search(this.query, this.page, this.showSinger, perpage).then((res) => {
        if (res.code === ERR_OK) {
          this._genResult(res.data).then((result) => {
            this.result = result;
            //   判断是否还有更多
            setTimeout(() => {
              this._checkMore(res.data);
            }, 20);
          });
        }
      });
    },
    searchMore() {
      // 上拉加载更多
      if (!this.hasMore) {
        return;
      }
      this.page++;
      search(this.query, this.page, this.showSinger, perpage).then((res) => {
        if (res.code === ERR_OK) {
          this._genResult(res.data).then((result) => {
            this.result = this.result.concat(result);
            setTimeout(() => {
              this._checkMore(res.data);
            }, 20);
          });
        }
      });
    },
    _checkMore(data) {
      // 检查数据是否还有更多
      const song = data.song;
      if (
        !song.list.length ||
        song.curnum + (song.curpage - 1) * perpage >= song.totalnum
      ) {
        this.hasMore = false;
      }
    },
    _genResult(data) {
      let ret = [];
      if (data.zhida && data.zhida.singerid && this.page === 1) {
        ret.push({ ...data.zhida, ...{ type: TYPE_SINGER } });
      }
      return processSongsUrl(this._normalizeSongs(data.song.list)).then(
        (songs) => {
          ret = ret.concat(songs);
          return ret;
        }
      );
    },
    _normalizeSongs(list) {
      // 处理数据
      let ret = [];
      list.forEach((musicData) => {
        if (isValidMusic(musicData)) {
          ret.push(createSong(musicData));
        }
      });
      return ret;
    },
    getIconCls(item) {
      //   判断 icon 图标
      if (item.type === TYPE_SINGER) {
        return "icon-mine";
      } else {
        return "icon-music";
      }
    },
    getDisplayName(item) {
      //   显示名称
      if (item.type === TYPE_SINGER) {
        return item.singername;
      } else {
        return `${item.name}-${item.singer}`;
      }
    },
    selectItem(item) {
      // 派发跳转歌曲/歌手事件
      if (item.type === TYPE_SINGER) {
        const singer = new Singer({
          id: item.singermid,
          name: item.singername,
        });
        this.$router.push({
          path: `/search/${singer.id}`,
        });
        this.SET_SINGER(singer);
      } else {
        // 歌曲
        this.insertSong(item);
      }
    },
    listScroll(){
        // 优化手机键盘派发事件
        this.$emit('listScroll')
    }
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/style/mixin.scss";
.suggest {
  height: 100%;
  overflow: hidden;
  .suggest-list {
    padding: 0 0.6rem;
    .suggest-item {
      display: flex;
      align-items: center;
      padding-bottom: 0.4rem;
      .icon {
        flex: 0 0 0.6rem;
        width: 0.6rem;
        [clase^="icon-"] {
          font-size: 0.28rem;
          color: $color-text-d;
        }
      }
      .name {
        flex: 1;
        font-size: $font-size-medium;
        color: $color-text-d;
        overflow: hidden;
        .text {
          @include ellipsis;
        }
      }
    }
  }
}
// 暂无结果
.no-result-wrapper {
  position: absolute;
  width: 100%;
  top: 50%;
  transform: translateY(-50%);
}
</style>