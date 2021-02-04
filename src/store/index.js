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
    sendErrorFlag: false,
    changeUserWallet: "",
    changeOtherUserWallet: "",
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
    resultSendWallet(state) {
      return {
        errorFlag: state.sendErrorFlag,
        changeUserWallet: state.changeUserWallet,
        changeOtherUserWallet: state.changeOtherUserWallet,
      }
    }
  },
  mutations: {
    setUserInfo(state, userAllData) {
      state.usersInfo = {};
      state.usersInfo = userAllData;
    },
    setLoginUserInfo(state, dataUserkey) {
      state.usersInfo[dataUserkey].userLoginFlag = !state.usersInfo[dataUserkey].userLoginFlag;
    },
    updateUserInfo(state, changeReceiveWallet) {
      console.log(changeReceiveWallet)
      state.usersInfo[changeReceiveWallet.sendUserKey].userWallet = changeReceiveWallet.sendWallet;
      state.usersInfo[changeReceiveWallet.receiveUserKey].userWallet = changeReceiveWallet.receiveWallet;
    },
    setErrorFlag(state, errorFlag) {
      state.sendErrorFlag = errorFlag;
    },
    setResultSend(state, changeUsersWallet) {
      state.changeUserWallet = changeUsersWallet.changeUserWallet;
      state.changeOtherUserWallet = changeUsersWallet.changeOtherUserWallet;
    }
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
    sendWallet: async function ({ commit }, { sendUser, receiveUser, sendWallet }) {
      let errorFlag = false
      commit('setErrorFlag', errorFlag);   //初期化
      const balance = sendUser.userWallet - sendWallet;
      const sendUserkey = sendUser.userKey;
      const sendUserInfo = {
        userName: sendUser.userName,
        userEmail: sendUser.userEmail,
        userPassword: sendUser.userPassword,
        userLoginFlag: false,
        userWallet: balance,
      }
      receiveUser.userWallet = Number(receiveUser.userWallet) + Number(sendWallet);
      const receiveUserkey = receiveUser.userKey;
      const receiveUserInfo = {
        userName: receiveUser.userName,
        userEmail: receiveUser.userEmail,
        userPassword: receiveUser.userPassword,
        userLoginFlag: false,
        userWallet: receiveUser.userWallet,
      }
      await firebase.database().ref(`userinfo/${sendUserkey}`).set(sendUserInfo, (error) => {
        if (error) {
          errorFlag = true;
          commit('setErrorFlag', errorFlag);
          return;
        }
      });
      await firebase.database().ref(`userinfo/${receiveUserkey}`).set(receiveUserInfo, (error) => {
        if (error) {
          errorFlag = true;
          commit('setErrorFlag', errorFlag);
          sendUserInfo.userWallet = sendUser.userWallet;
          firebase.database().ref(`userinfo/${sendUserkey}`).set(sendUserInfo, (error) => {
            //送信エラーに対してロールバック処理
            if (error) {
              console.error(error);
              alert('システムエラー');
              return;
            }
          })
          return;
        }
      });
      //正常に完了し、値の更新
      const changeReceiveWallet = {
        sendUserKey: sendUser.userKey,
        sendWallet: balance,
        receiveUserKey: receiveUser.userKey,
        receiveWallet: receiveUser.userWallet,
      }

      commit('updateUserInfo', changeReceiveWallet);
      const changeUsersWallet = {
        changeUserWallet: balance,
        changeOtherUserWallet: receiveUser.userWallet,
      }
      commit('setResultSend', changeUsersWallet);
    }
  },
  modules: {}
});