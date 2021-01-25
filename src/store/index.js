import Vue from "vue";
import Vuex from "vuex";
import firebase from "firebase/app";
import sha256 from 'crypto-js/sha256';
import Base64 from 'crypto-js/enc-base64';
import "firebase/database";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    nonce: "randamValue",
    usersInfo: {}
  },
  getters: {
    checkUserData: (state) => (dataEmail, dataPassword) => {
      const userskeys = Object.keys(state.usersInfo);
      let checkUserMail = 0;
      let checkUserLogin = 0;
      const hashPassword = sha256(dataPassword).toString(Base64);
      if (userskeys) {
        userskeys.forEach(userkey => {
          if (dataEmail === state.usersInfo[userkey].userEmail) {
            checkUserMail = 1;
            if (hashPassword === state.usersInfo[userkey].userPassword) {
              checkUserLogin = 1;
            }
          }
        })
      }
      return {
        emailResult: checkUserMail,
        loginResult: checkUserLogin
      }
    }
  },
  mutations: {
    setUserInfo(state, userAllData) {
      state.usersInfo = {};
      state.usersInfo = userAllData;
    },
  },
  actions: {
    onLoadData: async function ({ commit }) {
      const userAllData = await firebase.database().ref('userinfo/').once('value').catch(e => console.error(e));
      if (userAllData.val()) {                  //データnullの回避
        commit('setUserInfo', userAllData.val());
      } else {
        return;
      }
    },
    addInputData: async function ({ state, dispatch }, { dataName, dataEmail, dataPassword }) {
      const setUserData = {
        userName: dataName,
        userEmail: dataEmail,
        userPassword: sha256(dataPassword).toString(Base64)
      }
      let userId = 0;
      if (!Object.keys(state.usersInfo).length) {
        userId = 0;
      } else {
        userId = Object.keys(state.usersInfo).length;
      }
      firebase.database().ref(`userinfo/ + ID:${userId}`).set(setUserData, (error) => {
        if (error) {
          console.error(error);
        }
      });
      dispatch('onLoadData')
    },
  },
  modules: {}
});
