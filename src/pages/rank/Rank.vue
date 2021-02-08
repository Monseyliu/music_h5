<template >
  <div class="rank" ref="rank"> 
    <!-- 头部 -->
    <Scroll class="toplist" ref="toplist">
      <ul>
        <li @click="selectItem(item)" class="item" v-for="(item, index) in topList" :key="index">
          <!-- 图片 -->
          <div class="icon">
            <img width="100" height="100" v-lazy="item.picUrl" />
          </div>
          <!-- 歌曲数据 -->
          <ul class="songList">
            <li class="song" v-for="(song, i) in item.songList" :key="i">
              <span>{{ i + 1 }}</span>
              <span>{{ song.songname }}-{{ song.singername }}</span>
            </li>
          </ul>
        </li>
      </ul>
      <!-- loading  -->
      <div class="loading-container" v-show="!topList.length">
        <Loading />
      </div>
    </Scroll>
    <!-- 子路由 -->
    <router-view></router-view>
  </div>
</template>

<script>
// js 配置
import { getTopList } from "api/rank";
import { ERR_OK } from "api/config";
import { playlistMixin } from "config/js/mixin";
import { mapMutations } from 'vuex';
// 组件
import Scroll from "base/scroll";
import Loading from "base/loading/loading";

export default {
  mixins: [playlistMixin],
  name: "Rank",
  data() {
    return {
      topList: [],
    };
  },
  created() {
    this._getTopList();
  },
  components: {
    Scroll,
    Loading,
  },
  methods: {
      ...mapMutations(['SET_TOP_LIST']),
    _getTopList() {
      getTopList().then((res) => {
        if (res.code === ERR_OK) {
          this.topList = res.data.topList;
        }
      });
    },
    handlePlaylist(playlist){
        const bottom = playlist.length ? '1.2rem' : '';
        this.$refs.rank.style.bottom = bottom;
        this.$refs.toplist.refresh();
    },
    selectItem(item){
        // 歌曲详情
        this.$router.push({
            path: `/rank/${item.id}`
        })
        this.SET_TOP_LIST(item);
    }
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/style/mixin.scss";
.rank {
  position: fixed;
  width: 100%;
  top: 1.76rem;
  bottom: 0;
  .toplist {
    height: 100%;
    overflow: hidden;
    .item {
      display: flex;
      margin: 0 0.4rem;
      padding-top: 0.4rem;
      height: 2rem;
      &:last-child {
        padding-bottom: 0.4rem;
      }
      .icon {
        flex: 0 0 2rem;
      }
      .songList {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 0 0.4rem;
        height: 2rem;
        overflow: hidden;
        background: $color-highlight-background;
        color: $color-text-d;
        font-size: $font-size-small;
        .song {
          @include ellipsis;
          line-height: 0.52rem;
        }
      }
    }
  }
}
.loading-container {
  position: absolute;
  width: 100%;
  top: 50%;
  transform: translateY(-50%);
}
</style>