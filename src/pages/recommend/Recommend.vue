<template >
  <div class="recommend">
    <Scroll class="recommend-content" :data="discList" ref="scroll">
      <div>
        <!-- 轮播 -->
        <div class="slider-wrapper" v-if="slider.length">
          <div class="slider-content">
            <MSllider>
              <div v-for="item in slider" :key="item.id">
                <a :href="item.linkUrl">
                  <img class="needsclick" @load="loadImage" :src="item.picUrl" alt="" />
                </a>
              </div>
            </MSllider>
          </div>
        </div>
        <!-- 推荐列表 -->
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li class="item" v-for="item in discList" :key="item.dissid">
              <!-- 图标 -->
              <div class="icon">
                <img :src="item.imgurl" width="60" height="60" alt="" />
              </div>
              <!-- 描述 -->
              <div class="text">
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </Scroll>
  </div>
</template>

<script>
// 引入 轮播 滚动 组件
import MSllider from "components/base/slider";
import Scroll from "components/base/scroll";
// 获取推荐数据的方法 状态码
import { getRecommend, getDiscList } from "api/recommend.js";
import { ERR_OK } from "api/config.js";

export default {
  name: "MRecommend",
  data() {
    return {
      slider: [], //轮播图
      discList: [], //歌单列表
    };
  },
  components: {
    MSllider,
    Scroll,
  },
  created() {
    this._getRecommend();
    this._getDiscList();
  },
  methods: {
    _getRecommend() {
      // 获取轮播图
      getRecommend().then((res) => {
        if (res.code === ERR_OK) {
          this.slider = res.data.slider;
        }
      });
    },
    _getDiscList() {
      // 获取歌单列表
      getDiscList().then((res) => {
        if (res.code === ERR_OK) {
          this.discList = res.data.list;
        }
      });
    },
    loadImage() {
      // 监听图片load 事件，确保组件DOM完整渲染，使用BScroll
      if (!this.checkLoaded) {
        this.$refs.scroll.refresh();
        // 确保计算一次的逻辑
        this.checkLoaded = true;
      }
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
    // 轮播
    .slider-wrapper {
      position: relative;
      @include wh(100%, 0);
      padding-top: 40%;
      overflow: hidden;
      .slider-content {
        position: absolute;
        top: 0;
        left: 0;
        @include wh(100%, 100%);
      }
    }
    // 歌单列表
    .recommend-list {
      .list-title {
        height: 1.3rem;
        line-height: 1.3rem;
        text-align: center;
        @include sizeColor($font-size-medium, $color-theme);
      }
      .item {
        display: flex;
        box-sizing: border-box;
        align-items: center;
        padding: 0 0.4rem 0.4rem 0.4rem;
        .icon {
          flex: 0 0 1.2rem;
          width: 1.2rem;
          padding-right: 0.4rem;
        }
        .text {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          flex: 1;
          line-height: 0.4rem;
          font-size: $font-size-medium;
          .name {
            color: $color-text;
            padding-bottom: 0.15rem;
          }
          .desc {
            color: $color-text-d;
          }
        }
      }
    }
  }
}
</style>