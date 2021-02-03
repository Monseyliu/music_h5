<template >
    <div class="home">
        <!-- 头部 -->
        <MHeader />
        <!-- tab选择栏 -->
        <TabBar />
        <router-view></router-view>
    </div>
</template>

<script>
// 引入 头部 Tab 组件
import MHeader from "@/components/common/m-header/m-header";
import TabBar from "@/components/tabbar/TabBar";

export default {
    name: "",
    data(){
        return{}
    },
    components:{
        MHeader,
        TabBar
    },
    methods:{}
}
</script>

<style lang="scss" scoped>
    @import "~@/assets/style/mixin.scss";

</style>