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
    usersInfo: {},
  },
  getters: {
    checkUserData: (state) => (dataEmail, dataPassword) => {  //ユーザー登録情報の確認
      const userskeys = Object.keys(state.usersInfo);
      let checkUserMail = 0;
      let checkUserLogin = 0;
      const hashPassword = sha256(dataPassword).toString(Base64);
      if (userskeys) {
        userskeys.forEach(userkey => {
          if (dataEmail === state.usersInfo[userkey].userEmail) {
            checkUserMail = 1;
            if (hashPassword === state.usersInfo[userkey].userPassword) {
              checkUserLogin = userkey;
            }
          }
        })
      }
      return {
        emailResult: checkUserMail,
        dataLength: userskeys.length,
        loginResult: checkUserLogin
      }
    },
    logOnUser(state) { //ダッシュボードのユーザー情報取得
      const userskeys = Object.keys(state.usersInfo);
      let userInfo = {};
      let otherUsersInfo = [];
      if (userskeys) {
        userskeys.forEach(userkey => {
          if (state.usersInfo[userkey].userLoginFlag === true) {
            userInfo = state.usersInfo[userkey];
            userInfo.userKey = userkey;
          } else {
            const otheruserInfo = state.usersInfo[userkey];
            otheruserInfo.userKey = userkey;
            otherUsersInfo.push(otheruserInfo);
          }
        })
      }
      return {
        userInfo: userInfo,
        otherUsers: otherUsersInfo,
      }
    },
  },
  mutations: {
    setUserInfo(state, userAllData) {
      state.usersInfo = {};
      state.usersInfo = userAllData;
    },
    setLoginUserInfo(state, dataUserkey) {
      state.usersInfo[dataUserkey].userLoginFlag = !state.usersInfo[dataUserkey].userLoginFlag;
    },
    updateUserInfo(state, updateUser) {
      state.usersInfo[updateUser.userKey].userWallet = updateUser.userWallet;
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
    addInputData: async function ({ state }, { dataName, dataEmail, dataPassword }) {
      const setUserData = {
        userName: dataName,
        userEmail: dataEmail,
        userPassword: sha256(dataPassword).toString(Base64),
        userLoginFlag: false,
        userWallet: 0,
      }
      let userId = 0;
      if (!Object.keys(state.usersInfo).length) {
        userId = 0;
      } else {
        userId = Object.keys(state.usersInfo).length;
      }
      firebase.database().ref(`userinfo/ID:${userId}`).set(setUserData, (error) => {
        if (error) {
          console.error(error);
        }
      });
    },
    commitLoginUser({ commit }, { dataUserkey }) {
      commit('setLoginUserInfo', dataUserkey);
    },
    sendWallet({ commit }, { updateUser }) {
      const userkey = updateUser.userKey;
      const updateInfo = {
        userName: updateUser.userName,
        userEmail: updateUser.userEmail,
        userPassword: updateUser.userPassword,
        userLoginFlag: false,
        userWallet: updateUser.userWallet,
      }
      commit('updateUserInfo', updateUser);
      firebase.database().ref(`userinfo/${userkey}`).set(updateInfo, (error) => {
        if (error) {
          console.error(error);
        }
      });
    }
  },
  modules: {}
});
