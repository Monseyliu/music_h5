import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import state from './state'
import mutations from './mutations'
// 观察数据变化插件
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

// 开发调试使用debug-由于性能消耗-线上不适用
const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
