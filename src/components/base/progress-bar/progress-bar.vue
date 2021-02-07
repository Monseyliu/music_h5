<template >
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <!-- 进度条 组件 -->
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div
        class="progress-btn-wrapper"
        ref="progressBtn"
        @touchstart.prevent="progressTouchStart"
        @touchmove.prevent="progressTouchMove"
        @touchend.prevent="progressTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { prefixStyle } from "config/js/dom";

const progressBtnWidth = 16
  const transform = prefixStyle('transform')

  export default {
    props: {
      percent: {
        type: Number,
        default: 0
      }
    },
    created () {
      this.touch = {}
    },
    methods: {
      progressTouchStart (e) {
        this.touch.initiated = true
        this.touch.startX = e.touches[0].pageX
        this.touch.left = this.$refs.progress.clientWidth
      },
      progressTouchMove (e) {
        if (!this.touch.initiated) {
          return
        }
        const deltaX = e.touches[0].pageX - this.touch.startX
        const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth, Math.max(0, this.touch.left + deltaX))
        this._offset(offsetWidth)
        //this.$emit('percentChanging', this._getPercent())
      },
      progressTouchEnd () {
        this.touch.initiated = false
        this._triggerPercent()
      },
      progressClick (e) {
        const rect = this.$refs.progressBar.getBoundingClientRect()
        const offsetWidth = e.pageX - rect.left
        this._offset(offsetWidth)
        // 这里当我们点击 progressBtn 的时候，e.offsetX 获取不对
        // this._offset(e.offsetX)
        this._triggerPercent()
      },
      setProgressOffset (percent) {
        if (percent >= 0 && !this.touch.initiated) {
          const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
          const offsetWidth = percent * barWidth
          this._offset(offsetWidth)
        }
      },
      _triggerPercent () {
        this.$emit('percentChange', this._getPercent())
      },
      _offset (offsetWidth) {
        this.$refs.progress.style.width = `${offsetWidth}px`
        this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px,0,0)`
      },
      _getPercent () {
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        return this.$refs.progress.clientWidth / barWidth
      }
    },
    watch: {
      percent (newPercent) {
        this.setProgressOffset(newPercent)
      }
    }
};
</script>

<style lang="scss" scoped>
@import "~@/assets/style/mixin.scss";

.progress-bar {
  height: 0.6rem;
  margin: 0 0.1rem;
  .bar-inner {
    position: relative;
    top: 0.26rem;
    height: 0.08rem;
    background: rgba(0, 0, 0, 0.3);
    .progress {
      position: absolute;
      height: 100%;
      background: $color-theme;
    }
    .progress-btn-wrapper {
      position: absolute;
      left: -0.16rem;
      top: -0.26rem;
      @include wh(0.6rem, 0.6rem);
      .progress-btn {
        position: relative;
        top: 0.14rem;
        left: 0.14rem;
        box-sizing: border-box;
        @include wh(0.32rem, 0.32rem);
        border: 3px solid $color-text;
        border-radius: 50%;
        background: $color-theme;
      }
    }
  }
}
</style>