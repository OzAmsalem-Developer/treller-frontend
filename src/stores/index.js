import Vue from 'vue'
import Vuex from 'vuex'
import {boardStore} from '@/stores/board.store'
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
