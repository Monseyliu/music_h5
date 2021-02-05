<template >
    <div class="loading">
        <!-- 公共 loading 组件 -->
        <img width="24" height="24" src="./loading.gif" alt="">
        <p class="desc">{{title}}</p>
    </div>
</template>

<script>
export default {
    name: "Loading",
    props: {
        title: {
            type: String,
            default: '正在载入...'
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/style/mixin.scss";
.loading{
    width: 100%;
    text-align: center;
    .desc{
        line-height: .4rem;
        font-size: $font-size-small;
        color: $color-text-l;
    }
}
    
</style>