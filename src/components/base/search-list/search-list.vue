<template >
  <div class="search-list" v-show="searches.length">
    <ul>
      <li
        @click="selectItem(item)"
        class="search-item"
        v-for="(item, index) in searches"
        :key="index"
      >
        <span class="text">{{ item }}</span>
        <span class="icon" @click.stop="deleteOne(item)">
          <i class="icon-delete"></i>
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "",
  props: {
    searches: {
      type: Array,
      default: [],
    },
  },
  methods: {
    selectItem(item) {
      // 选择本地数据搜索
      this.$emit("select", item);
    },
    deleteOne(item) {
      //   删除单个
      this.$emit("delete", item);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/style/mixin.scss";

.search-list {
  .search-item {
    display: flex;
    align-items: center;
    height: 0.8rem;
    overflow: hidden;
    .text {
      flex: 1;
    }
    .icon {
      @include extend-click();
      .icon-delete {
        font-size: $font-size-small;
        color: $color-text-d;
      }
    }
  }
}
</style>