<template >
  <div class="singer">
      <!-- 歌手列表 -->
      <ListView :data="singers" />
  </div>
  
  
</template>

<script>
// js 配置
import { getSingerList } from "api/singer";
import { ERR_OK } from "api/config";
import Singer from "config/js/singer";
// 组件
import ListView from "components/base/listView/listView"

//热门歌曲
const HOT_NAME = "热门";
const HOT_SINGER_LEN = 10;

export default {
  name: "MSinger",
  data() {
    return {
      singers: [], //歌手列表
    };
  },
  components:{
      ListView
  },
  created() {
    this._getSingerList();
  },
  methods: {
    _getSingerList() {
      // 获取歌手数据
      getSingerList().then((res) => {
        if (res.code === ERR_OK) {
          this.singers = this._normalizeSinger(res.data.list);
          console.log(this.singers)
        }
      });
    },
    _normalizeSinger(list) {
      // 处理获取的list数据
      let map = {
        hot: {
          title: HOT_NAME,
          items: [],
        },
      };
      list.forEach((item, index) => {
        if (index < HOT_SINGER_LEN) {
          map.hot.items.push(
            new Singer({
              id: item.Fsinger_mid,
              name: item.Fsinger_name,
            })
          );
        }
        // 字母 获取
        const key = item.Findex;
        if (!map[key]) {
          map[key] = {
            title: key,
            items: [],
          };
        }
        map[key].items.push(
          new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name,
          })
        );
      });
      //   处理得到的数据获得有序列表 -map
      // 热门
      let hot = [];
      // 全部
      let ret = [];
      for (let key in map) {
        let val = map[key];
        if (val.title.match(/[a-zA-Z]/)) {
          ret.push(val);
        } else if (val.title === HOT_NAME) {
          hot.push(val);
        }
      }
      //   排序a-z歌手
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0);
      });
      return hot.concat(ret)
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/style/mixin.scss";
.singer {
  position: fixed;
  top: 1.7rem;
  bottom: 0;
  width: 100%;
}
</style>