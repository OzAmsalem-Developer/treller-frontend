import Vue from 'vue'
import Vuex from 'vuex'
import {boardStore} from '@/store/modules/board.store.js'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isMenuOpen: false // Handle with screen
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    boardStore
  }
})
