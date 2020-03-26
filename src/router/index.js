import Vue from 'vue'
import VueRouter from 'vue-router'
import homePage from '../views/home-page.vue'
import aboutPage from '../views/about-page.vue'
import dashboardPage from '../views/dashboard-page.vue'
import boardApp from '../views/board-views/board-app.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: homePage
  },
  {
    path: '/about',
    name: 'About',
    component: aboutPage
  },
  {
    path: '/user/:userId',
    name: 'Dashboard',
    component: dashboardPage
    // children: [{
    //   path: '/usedId/profile',
    //   name: 'Profile',
    //   component: profilePage
    // }],
  },
  {
    path: '/board/:boardId',
    name: 'BoardApp',
    component: boardApp
  },
  {
    path: '/board/:boardId/task/:taskId',
    name: 'TaskDetails',
    component: boardApp
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router