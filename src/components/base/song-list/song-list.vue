<template >
  <div class="song-list">
    <ul>
      <li
        class="item"
        @click="selectItem(song, index)"
        v-for="(song, index) in songs"
        :key="index"
      >
        <!-- 排行 -->
        <div class="rank" v-show="rank">
          <span :class="getRankCls(index)" v-text="getRankText(index)"></span>
        </div>
        <!-- 内容 -->
        <div class="content">
          <h2 class="name">{{ song.name }}</h2>
          <p class="desc">{{ getDesc(song) }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "",
  props: {
    songs: {
      type: Array,
      default: [],
    },
    rank: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  methods: {
    getDesc(song) {
      return `${song.singer}·${song.album}`;
    },
    // 派发点击歌曲事件
    selectItem(item, index) {
      this.$emit("select", item, index);
    },
    getRankCls(index) {
      if (index <= 2) {
        return `icon icon${index}`;
      } else {
        return "text";
      }
    },
    getRankText(index) {
      if (index > 2) {
        return index + 1;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/style/mixin.scss";
.song-list {
  .item {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 1.1rem;
    font-size: $font-size-medium;
    .rank {
      flex: 0 0 0.5rem;
      width: 0.5rem;
      margin-right: 0.6rem;
      text-align: center;
      .icon {
        display: inline-block;
        width: 0.5rem;
        height: 0.48rem;
        background-size: 0.5rem 0.48rem;
      }
      .icon0 {
        @include bg-image("first");
      }
      .icon1 {
        @include bg-image("second");
      }
      .icon2 {
        @include bg-image("third");
      }
      .text {
        color: $color-theme;
        font-size: $font-size-large;
      }
    }
    .content {
      flex: 1;
      line-height: 0.4rem;
      overflow: hidden;
      .name {
        @include ellipsis;
        color: $color-text;
      }
      .desc {
        @include ellipsis;
        margin-top: 0.1rem;
        color: $color-text-d;
      }
    }
  }
}
</style>