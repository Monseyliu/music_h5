<template >
  <transition name="slide">
    <MusicList :title="title" :bgImage="bgImage" :songs="songs"></MusicList>
  </transition>
</template>

<script>
// js 配置
import { mapGetters } from "vuex";
import { getSongList } from "api/recommend";
import { ERR_OK } from "api/config";
import { createSong } from "config/js/song";
// 组件
import MusicList from "common/music-list/music-list";
export default {
  name: "",
  data() {
    return {
      songs: [], //歌曲列表
    };
  },
  computed: {
    ...mapGetters(["disc"]),
    title() {
      return this.disc.dissname;
    },
    bgImage() {
      return this.disc.imgurl;
    },
  },
  components: {
    MusicList,
  },
  created() {
    this._getSongList();
  },
  methods: {
    //   歌单歌曲获取
    _getSongList() {
      if (!this.disc.dissid) {
        this.$router.push("/recommend");
        return;
      }
      getSongList(this.disc.dissid).then((res) => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizeSongs(res.cdlist[0].songlist);
        }
      });
    },
    _normalizeSongs(list) {
      let ret = [];
      list.forEach((musicData) => {
        if (musicData.songid && musicData.albumid) {
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