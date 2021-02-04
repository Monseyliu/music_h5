<template>
  <div id="app">
    <keep-alive>
      <router-view />
    </keep-alive>
  </div>
</template>

<style lang="scss">
@import "~@/assets/style/mixin.scss";

#app {
  color: $color-theme;
}
</style>
