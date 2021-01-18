import Vue from "vue";
import Vuex from "vuex";
import firebase from "firebase/app";
import "firebase/database";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userInfo: []
  },
  mutations: {
    setUserInfo(state, userAllData) {
      const userKeys = Object.keys(userAllData)
      state.userInfo = [];
      userKeys.forEach(userKey => {
        state.userInfo.push(userAllData[userKey]);
      })
      console.log(state.userInfo);
    },
  },
  actions: {
    onLoadData({ commit }) {
      firebase.database().ref('userinfo/').once('value', (snapShotAllData) => {
        const userAllData = snapShotAllData.val();
        commit('setUserInfo', userAllData);
      })
    },
    addInputData({ commit }, { setUsername, setEmail, setPassword }) {
      const setUserData = {
        userName: setUsername,
        userEmail: setEmail,
        userPassword: setPassword
      }
      firebase.database().ref('userinfo/' + setUsername).set(setUserData);
      firebase.database().ref('userinfo/').once('value', (snapShotAllData) => {
        const userAllData = snapShotAllData.val();
        commit('setUserInfo', userAllData);
      })
    },
  },
  modules: {}
});
