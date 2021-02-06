<template >
  <div class="home">
    <!-- 头部 -->
    <MHeader />
    <!-- tab选择栏 -->
      <TabBar />
      <keep-alive>
      <router-view></router-view>
      </keep-alive>
      <!-- 播放器组件 不受路由限制 -->
      <Player />
  </div>
</template>

<script>
// 引入 头部 Tab Player 组件
import MHeader from "components/common/m-header/m-header";
import TabBar from "components/tabbar/TabBar";
import Player from "components/common/player/player"

export default {
  name: "",
  data() {
    return {};
  },
  components: {
    MHeader,
    TabBar,
    Player
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
@import "~@/assets/style/mixin.scss";
.home{
    overflow: hidden;
}
</style>