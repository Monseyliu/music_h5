<template >
  <div class="tab-bar">
    <router-link
      tag="div"
      class="tab-item"
      :to="item.path"
      v-for="item of list"
      :key="item.id"
    >
      <span class="tab-link">{{ item.title }}</span>
    </router-link>
  </div>
</template>

<script>
export default {
  name: "TabBar",
  data() {
    return {
      list: [
        { id: 11, path: "/recommend", title: "推荐" },
        { id: 12, path: "/singer", title: "歌手" },
        { id: 13, path: "/rank", title: "排行" },
        { id: 14, path: "/search", title: "搜索" },
      ],
    };
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
@import "~@/assets/style/mixin.scss";

.tab-bar {
  display: flex;
  height: $headHeight;
  line-height: $headHeight;
  font-size: $font-size-medium;
  .tab-item {
    flex: 1;
    text-align: center;
    .tab-link {
      padding-bottom: 0.1rem;
      color: $color-text-l;
    }
  }
  .router-link-active {
    .tab-link {
      color: $color-theme;
      border-bottom: .05rem solid $color-theme;
    }
  }
}
</style>