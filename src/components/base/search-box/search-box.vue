<template >
  <div class="search-box">
    <i class="icon-search"></i>
    <input ref="query" type="text" class="box"
    v-model="query" :placeholder="placeholder"/>
    <i class="icon-dismiss" v-show="query" @click="clear"></i>
  </div>
</template>

<script>
// js配置
import { debounce } from "config/js/util"

export default {
  name: "",
  data() {
    return {
        query: '', //搜索内容
    };
  },
  props:{
      placeholder: {
          type: String,
          default: '搜索歌曲/歌手'
      }
  },
  created(){
    //   将query暴露出去
    this.$watch('query', debounce((newQuery) => {
        this.$emit('query', newQuery)
    }, 200))
  },
  methods: {
      clear(){
        //   清空搜索框
        this.query = '';
      },
      setQuery(query){
        //   设置query方法 
        this.query = query
      },
      blur(){
          this.$refs.query.blur();
      }
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/style/mixin.scss";
.search-box {
  @include wh(100%, 0.8rem);
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding: 0 0.12rem;
  border-radius: 0.12rem;
  background: $color-highlight-background;
  .icon-search {
    font-size: 0.48rem;
    color: $color-background;
  }
  .box {
    flex: 1;
    margin: 0 0.1rem;
    line-height: 0.36rem;
    background: $color-highlight-background;
    color: $color-text;
    font-size: $font-size-medium;
    outline: 0;
    &::placeholder{
        color: $color-text-d;
    }
  }
  .icon-dismiss {
      font-size: .32rem;
      color: $color-background;
  }
}
</style>