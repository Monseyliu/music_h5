<template >
  <div class="recommend">
    <div class="recommend-content">
      <!-- 轮播 -->
      <div class="slider-wrapper" v-if="slider.length">
        <div class="slider-content">
          <MSllider>
            <div v-for="item in slider" :key="item.id">
              <a :href="item.linkUrl">
                <img :src="item.picUrl" alt="" />
              </a>
            </div>
          </MSllider>
        </div>
      </div>
      <!-- 推荐列表 -->
      <div class="recommend-list">
        <h1 class="list-title">热门歌单推荐</h1>
        <ul></ul>
      </div>
    </div>
  </div>
</template>

<script>
import MSllider from "components/base/slider";
// 获取推荐数据的方法 状态码
import { getRecommend } from "api/recommend.js";
import { ERR_OK } from "api/config.js";

export default {
  name: "MRecommend",
  data() {
    return {
      slider: [],
    };
  },
  components: {
    MSllider,
  },
  created() {
    this._getRecommend();
  },
  methods: {
    _getRecommend() {
      getRecommend().then((res) => {
        if (res.code === ERR_OK) {
          this.slider = res.data.slider;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/style/mixin.scss";

.recommend {
  position: fixed;
  width: 100%;
  bottom: 0;
  top: 1.72rem;
  .recommend-content {
    height: 100%;
    overflow: hidden;
    .slider-wrapper {
      position: relative;
      @include wh(100%, 0);
      padding-top: 40%;
      overflow: hidden;
      .slider-content{
        position: absolute;
        top: 0;
        left: 0;
        @include wh(100%,100%);
      }
    }

    .recommend-list {
      .list-title {
        height: 1.3rem;
        line-height: 1.3rem;
        text-align: center;
        @include sizeColor($font-size-medium, $color-theme);
      }
    }
  }
}
</style>