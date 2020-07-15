import Vue from 'vue'
import Vuex from 'vuex'
import auth from './modules/auth'
import incident from "./modules/incident"
import criterion from "./modules/criterion"
import user from "./modules/user"

Vue.use(Vuex)

export default new Vuex.Store({
  modules:{
    auth,
    incident,
    criterion,
    user,
  },
})