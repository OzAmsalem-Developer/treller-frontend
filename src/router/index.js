import Vue from 'vue'
import VueRouter from 'vue-router'
import homePage from '../views/home-page.vue'
import aboutPage from '../views/about-page.vue'
import dashboardPage from '../views/dashboard-page.vue'
import taskDetails from '../views/task-details.vue'


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
    path: '/user/:userId?',
    // children: [{
    //   path: '/usedId/profile',
    //   name: 'Profile',
    //   component: profilePage
    // }],
    name: 'Dashboard',
    component: dashboardPage
  },
  {
    path: '/board/:boardId/task?/:taskId?',
    name: 'TaskDetails',
    component: taskDetails
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router