import Vue from 'vue'
import Router from 'vue-router'

import Login from '../components/Login'
import Layout from "../components/Layout";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'main',
      component: Layout,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        requiresVisitor: true,
      }
    },
  ]
});