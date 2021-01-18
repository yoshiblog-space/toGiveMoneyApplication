import Vue from "vue";
import Vuex from "vuex";
import firebase from "firebase/app";
import "firebase/database";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userInfo:[]
  },
  mutations: {
    addUserInfo(state, setUserData){
      state.userInfo.push(setUserData);
    }
  },
  actions: {
    addInputData({ commit },{setUsername, setEmail, setPassword}) {
      const setUserData = {
        userName: setUsername,
        userEmail: setEmail,
        userPassword : setPassword
      }
      firebase.database().ref('userinfo/' + setUsername).set(setUserData);
      commit('addUserInfo',setUserData);
    },
  },
  modules: {}
});
