import { userService } from '@/services/user.service.js'

export const userStore = {
  state: {
    loggedinUser: null
  },
  getters: {
    loggedinUser(state) {
      return state.loggedinUser
    }
  },
  mutations: {
    setLoggedinUser(state, { user }) {
      state.loggedinUser = user
    }
  },
  actions: {
    async getLoggedinUser(context) {
      const user = await userService.getLoggedInUser()
      context.commit({type: 'setLoggedinUser', user})
    },
    async login(context, { credentials }) {
      try {
        const user = await userService.login(credentials)
        context.commit({type: 'setLoggedinUser', user})
        return user
      } catch {
        console.log(user);
        console.log('error - unautorized');
        throw new Error
      }
    },
    async signup(context, { credentials }) {
      const user = await userService.signup(credentials)
      try {
        context.commit({type: 'setLoggedinUser', user})
      } catch {
        console.log('error - not singed up');
      }
    },
    async updateUser(context, { user }) {
      await userService.update(user)
      context.commit({type: 'setLoggedinUser', user})
      return user
    },
    async loadUsers(context, {searchStr = ''}) {
      const users = await userService.query(searchStr)
      return users
    },
    async logout(context) {
      await userService.logout()
    }
  }
}