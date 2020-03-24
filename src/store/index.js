import Vue from 'vue'
import Vuex from 'vuex'
import {boardStore} from '@/store/modules/board.store.js'
Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  state: {
    isScreenOpen: false
  },
  getters: {
    isScreenOpen(state) {
      return state.isScreenOpen
    }
  },
  mutations: {
    openScreen(state) {
      state.isScreenOpen = true
    },
    closeScreen(state) {
      state.isScreenOpen = false
    }
  },
  modules: {
    boardStore
  }
})
