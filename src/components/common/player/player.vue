<template >
  <div class="player" v-show="playlist.length > 0">
    <!-- 播放器组件 - 正常播放器 -->
    <div class="normal-player" v-show="fullScreen">播放器</div>
    <!-- mini 播放器 -->
    <div class="mini-player" v-show="!fullScreen"></div>
  </div>
</template>

<script>
// 引入 vuex 相关数据
import { mapGetters } from "vuex";
export default {
  name: "Player",
  data() {
    return {};
  },
  computed:{
      ...mapGetters(['fullScreen', 'playlist'])
  },
  methods: {},
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
  }
}
</style>