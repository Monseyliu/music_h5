<template >
  <div class="search">
    <!-- 搜索框 -->
    <div class="search-box-wrapper">
      <SearchBox @query="onQueryChange" ref="searchBox" />
    </div>
    <!-- hotkey -->
    <div class="shortcut-wrapper" v-show="!query" ref="shortcutWrapper">
      <Scroll class="shortcut" :data="shortcut" ref="shortcut">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li
                @click="addQuery(item.k)"
                class="item"
                v-for="item in hotKey"
                :key="item.n"
              >
                {{ item.k }}
              </li>
            </ul>
          </div>
          <!-- 搜索历史 -->
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="showConfirm">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <!-- 组件 -->
            <SearchList
              :searches="searchHistory"
              @select="addQuery"
              @delete="deleteSearchHistory"
            />
          </div>
        </div>
      </Scroll>
    </div>
    <!-- 搜索结果 -->
    <div class="search-result" v-show="query" ref="searchResult">
      <Suggest ref="suggest" :query="query" @listScroll="blurInput" @select="saveSearch" />
    </div>
    <!-- 弹窗组件 -->
    <Confirm
      ref="confirm"
      text="是否清空所有搜索历史记录"
      confirmBtnText="清空"
      @confirm="clearSearchHistory"
    />
    <!-- 子路由-->
    <router-view></router-view>
  </div>
</template>

<script>
// 组件
import SearchBox from "base/search-box/search-box";
import Suggest from "common/suggest/suggest";
import SearchList from "base/search-list/search-list";
import Confirm from "base/confirm/confirm";
import Scroll from "base/scroll";
// js 配置
import { getHotKey } from "api/search";
import { ERR_OK } from "api/config";
import { mapActions, mapGetters } from "vuex";
import { playlistMixin } from "config/js/mixin";

export default {
  mixins: [playlistMixin],
  name: "MSearch",
  data() {
    return {
      hotKey: [],
      query: "", //
    };
  },
  components: {
    SearchBox,
    Suggest,
    SearchList,
    Confirm,
    Scroll,
  },
  created() {
    this._getHotKey();
  },
  computed: {
    ...mapGetters(["searchHistory"]),
    shortcut() {
      // 用于scroll组件，两个异步数据
      return this.hotKey.concat(this.searchHistory);
    },
  },
  watch: {
    query(newQuery) {
      if (!newQuery) {
        setTimeout(() => {
          this.$refs.shortcut.refresh();
        }, 20);
      }
    },
  },
  methods: {
    ...mapActions([
      "saveSearchHistory",
      "deleteSearchHistory",
      "clearSearchHistory",
    ]),
    _getHotKey() {
      // 获取热门KEy
      getHotKey().then((res) => {
        if (res.code === ERR_OK) {
          this.hotKey = res.data.hotkey.slice(0, 15);
        }
      });
    },
    onQueryChange(query) {
      // 接收搜索框的query
      this.query = query;
    },
    addQuery(query) {
      this.$refs.searchBox.setQuery(query);
    },
    blurInput() {
      //
      this.$refs.searchBox.blur();
    },
    saveSearch() {
      // 保存搜索结果
      this.saveSearchHistory(this.query);
    },
    showConfirm() {
      //
      this.$refs.confirm.show();
    },
    handlePlaylist(playlist){
        // 动态计算高度
        const bottom = playlist.length > 0 ? '1.2rem' : '';
        this.$refs.shortcutWrapper.style.bottom = bottom;
        this.$refs.shortcut.refresh();

        this.$refs.searchResult.style.bottom = bottom;
        this.$refs.suggest.refresh();
    }
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/style/mixin.scss";
.search {
  .search-box-wrapper {
    margin: 0.4rem;
  }
  //   hotkey
  .shortcut-wrapper {
    position: fixed;
    top: 3.56rem;
    bottom: 0;
    width: 100%;
    .shortcut {
      height: 100%;
      overflow: hidden;
      .hot-key {
        margin: 0 0.4rem 0.4rem 0.4rem;
        .title {
          margin-bottom: 0.4rem;
          font-size: $font-size-medium;
          color: $color-text-l;
        }
        ul {
          .item {
            display: inline-block;
            padding: 0.1rem 0.2rem;
            margin: 0 0.4rem 0.2rem 0;
            border-radius: 0.12rem;
            background: $color-highlight-background;
            font-size: $font-size-medium;
            color: $color-text-d;
          }
        }
      }
    }
  }
  //   搜索历史
  .search-history {
    position: relative;
    margin: 0 0.4rem;
    .title {
      display: flex;
      align-items: center;
      height: 0.8rem;
      font-size: $font-size-medium;
      color: $color-text-l;
      .text {
        flex: 1;
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
  //   搜索结果
  .search-result {
    position: fixed;
    width: 100%;
    top: 3.56rem;
    bottom: 0;
  }
}
</style>