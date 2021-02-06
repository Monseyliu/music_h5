<template >
  <transition name="slide">
    <music-list :songs="songs" :title="title" :bgImage="bgImage"></music-list>
  </transition>
</template>

<script>
// 从state中取值 和组件
import { mapGetters } from "vuex";
import MusicList from "components/common/music-list/music-list"
// 引入js配置
import { getSingerDetail } from "api/singer";
import { ERR_OK } from "api/config";
import { createSong, isValidMusic, processSongsUrl } from "config/js/song";

export default {
  name: "SingerDetail",
  data() {
    return {
      songs: [], //歌曲列表
    };
  },
  components:{
    MusicList
  },
  computed: {
    ...mapGetters(["singer"]),
    title(){
      // 标题
      return this.singer.name
    },
    bgImage(){
      // 头像
      return this.singer.avatar
    },
  },
  created() {
    this._getDetail();
  },
  methods: {
    _getDetail() {
      // 获取歌手详情 如果没有id则返回歌手页面
      if (!this.singer.id) {
        this.$router.push("/singer");
        return;
      }
      // 处理 歌曲URL
      getSingerDetail(this.singer.id).then((res) => {
        if (res.code === ERR_OK) {
          processSongsUrl(this._normalizeSongs(res.data.list)).then((songs) => {
            this.songs = songs;
            // console.log(this.songs)
          });
        }
      });
    },
    _normalizeSongs(list) {
      // 处理获取的数据
      let ret = [];
      list.forEach((item) => {
        // 结构出 musicData
        let { musicData } = item;
        if (musicData.songid && musicData.albummid) {
          // 调用createSong方法
          ret.push(createSong(musicData));
        }
      });
      return ret;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/style/mixin.scss";

// 动画
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s;
}
.slide-enter,
.slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>