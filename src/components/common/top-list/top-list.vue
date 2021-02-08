<template >
  <transition name="slide">
    <MusicList
      :rank="rank"
      :title="title"
      :bgImage="bgImage"
      :songs="songs"
    ></MusicList>
  </transition>
</template>

<script>
//js 配置
import { mapGetters } from "vuex";
import { getMusicList } from "api/rank";
import { ERR_OK } from "api/config";
import { createSong, isValidMusic, processSongsUrl } from "config/js/song";
// 组件
import MusicList from "common/music-list/music-list";
export default {
  name: "",
  data() {
    return {
      songs: [], //歌曲列表
      rank: true,
    };
  },
  components: {
    MusicList,
  },
  computed: {
    ...mapGetters(["topList"]),
    title() {
      return this.topList.topTitle;
    },
    bgImage() {
      if (this.songs.length) {
        return this.songs[0].image;
      }
      return "";
    },
  },
  created() {
    this._getMusicList();
  },
  methods: {
    _getMusicList() {
      if (!this.topList.id) {
        this.$router.push("/rank");
        return;
      }
      getMusicList(this.topList.id).then((res) => {
        if (res.code === ERR_OK) {
          processSongsUrl(this._normalizeSongs(res.songlist)).then((songs) => {
            this.songs = songs;
          });
        }
      });
    },
    _normalizeSongs(list) {
      let ret = [];
      list.forEach((item) => {
        const musicData = item.data;
        if (isValidMusic(musicData)) {
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

//transition动画
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}
.slide-enter,
.slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>