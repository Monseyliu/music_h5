<template >
    <div class="m-header">
        <div class="icon"></div>
        <h1 class="text">Happy Music</h1>
    </div>
</template>

<script>
export default {
    name: "MHeader",
    data(){
        return{}
    },
    methods:{}
}
</script>

<style lang="scss" scoped>
@import "~@/assets/style/mixin.scss";
.m-header{
    position: relative;
    height: $headHeight;
    text-align: center;
    color: $color-theme;
    font-size: 0;
    .icon{
        display: inline-block;
        @include bg-image('logo');
        vertical-align: top;
        margin-top: .16rem;
        @include wh(.6rem, .6rem);
        background-size: cover;
    }
    .text{
        display: inline-block;
        vertical-align: top;
        line-height: $headHeight;
        font-size: $font-size-large;
        margin-left: .2rem;
    }
}
    
</style>