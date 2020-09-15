import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from "./router/router";
import store from './store'

Vue.config.productionTip = false;
Vue.use(require('vue-moment'));

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.getters.loggedIn) {
      next({
        name: 'login',
      })
    } else {
      if (to.matched.some(record => record.meta.hidden)) {
        if (store.getters.roleCurrentUser !== 'ROLE_ADMIN' && store.getters.roleCurrentUser !== 'ROLE_HEAD') {
          next({
            name: 'create-incident',
          })
        } else {
          next()
        }
      } else {
        next()
      }
    }
  } else {
    if (to.matched.some(record => record.meta.requiresVisitor)) {
      if (store.getters.loggedIn) {
        next({
          name: 'create-incident',
        })
      } else {
        next()
      }
    } else {
      next()
    }
  }
})

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
