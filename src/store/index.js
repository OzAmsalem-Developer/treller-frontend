import Vue from 'vue'
import Vuex from 'vuex'
import {boardStore} from '@/store/modules/board.store.js'
import {userStore} from '@/store/modules/user.store.js'
Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  modules: {
    boardStore,
    userStore
  }
})
