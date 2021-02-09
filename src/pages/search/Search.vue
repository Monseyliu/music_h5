<template >
  <div class="search">
    <!-- 搜索框 -->
    <div class="search-box-wrapper">
      <SearchBox @query="onQueryChange" ref="searchBox" />
    </div>
    <!-- hotkey -->
    <div class="shortcut-wrapper" v-show="!query">
      <div class="shortcut">
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
      </div>
    </div>
    <!-- 搜索结果 -->
    <div class="suearch-result" v-show="query">
      <Suggest :query="query" @listScroll="blurInput" />
    </div>
    <!-- 子路由-->
    <router-view></router-view>
  </div>
</template>

<script>
// 组件
import SearchBox from "base/search-box/search-box";
import Suggest from "common/suggest/suggest";
// js 配置
import { getHotKey } from "api/search";
import { ERR_OK } from "api/config";

export default {
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
  },
  created() {
    this._getHotKey();
  },
  methods: {
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
    blurInput(){
        // 
        this.$refs.searchBox.blur()
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
  //   搜索结果
  .suearch-result {
    position: fixed;
    width: 100%;
    top: 3.56rem;
    bottom: 0;
  }
}
</style>