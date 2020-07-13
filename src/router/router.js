import Vue from 'vue'
import Router from 'vue-router'

import Login from '../components/Login'
import CreateIncident from "../components/incidents/Create";
import ListIncident from "../components/incidents/List";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'list-incident',
      component: ListIncident,
      meta: {
        layout: 'mainLayout',
        requiresAuth: true,
      }
    },
    {
      path: '/create-incident',
      name: 'create-incident',
      component: CreateIncident,
      meta: {
        layout: 'mainLayout',
        requiresAuth: true,
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        layout: 'loginLayout',
        requiresVisitor: true,
      }
    },
  ]
});