import { userService } from '@/services/user.service.js'

export const userStore = {
  state: {
    loggedinUser: userService.getLoggedInUser(),
    filterBy: {
      txt: ''
    }
  },
  getters: {
    loggedinUser(state) {
      return state.loggedinUser
    }
  },
  mutations: {
    setLoggedinUser(state, { user }) {
      state.loggedinUser = user
    },
    setFilterBy(state, { filterBy }) {
      state.filterBy = filterBy
    }
  },
  actions: {
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
      await userService.updateUser(user)
      context.commit({type: 'setLoggedinUser', user})
    },
    async loadUsers(context) {
      const filterBy = context.state.filterBy
      const users = await userService.query(filterBy)
      return users
    },
  }
}