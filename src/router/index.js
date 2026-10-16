import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/user'
  },
  {
    path: '/user',
    name: 'user',
    component: () => import('../views/element/UserView.vue')
  },
  {
    path: '/question',
    name: 'question',
    component: () => import('../views/element/QuestionView.vue')
  }
]

const router = new VueRouter({
  mode: 'hash',
  routes
})

export default router
