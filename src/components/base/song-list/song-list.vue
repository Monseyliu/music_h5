<template >
  <div class="song-list">
    <ul>
      <li class="item" @click="selectItem(song, index)" v-for="(song, index) in songs" :key="index">
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
  },
  data() {
    return {};
  },
  methods: {
    getDesc(song) {
      return `${song.singer}。${song.album}`;
    },
    // 派发点击歌曲事件
    selectItem(item, index){
      this.$emit('select', item, index);
    }
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