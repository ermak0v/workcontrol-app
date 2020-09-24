import Vue from 'vue'
import Router from 'vue-router'

import Login from '../components/Login'
import CreateIncident from "../components/incidents/Create";
import ListIncident from "../components/incidents/List";
import Moderation from "../components/incidents/Moderation";

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/list-incident',
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
      path: '/moderation',
      name: 'moderation',
      component: Moderation,
      meta: {
        layout: 'mainLayout',
        requiresAuth: true,
        hidden: true,
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