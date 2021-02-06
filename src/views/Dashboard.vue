<template>
  <div class="dashboard">
    <img alt="Vue logo" src="../assets/logo.png" />
    <div class="welcome">
      <div class="userinfo">
        <p class="subtitle is-5">{{ userAllData.userName }}さんようこそ！！</p>
        <p class="subtitle is-5">残高:{{ userAllData.userWallet }}</p>
      </div>
      <button class="button is-link is-outlined logout" @click="logoutUser">
        ログアウト
      </button>
    </div>

    <h3 class="subtitle is-3">ユーザ一覧</h3>
    <table>
      <tbody>
        <tr>
          <th class="userwidth has-text-left is-size-5">ユーザ名</th>
        </tr>
        <tr v-for="otherUser in otherUsers" :key="otherUser.userEmail">
          <td class="userwidth has-text-left is-size-6 has-text-weight-light">
            {{ otherUser.userName }}
          </td>
          <td>
            <div class="buttons">
              <button
                v-on:click="openShowModal(otherUser)"
                class="button is-focused is-info is-size-6 walletbutton"
              >
                walletを見る
              </button>
            </div>
          </td>
          <td>
            <div class="buttons">
              <button
                v-on:click="openSendModal(otherUser)"
                class="sendbutton button is-focused is-info is-size-6"
              >
                送る
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <transition name="fade">
      <div id="overlay" v-if="showContent"></div>
    </transition>
    <transition name="trans">
      <div id="content" v-if="showContent">
        <p>{{ dialogName }}さんの残高</p>
        <p class="walletdisplay">{{ dialogWallet }}</p>
        <div id="contentfooter">
          <button
            class="button is-danger closebutton"
            v-on:click="closeShowModal"
          >
            close
          </button>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div id="overlay" v-if="sendContent"></div>
    </transition>
    <transition name="trans">
      <div id="sendcontent" v-if="sendContent">
        <p>あなたの残高：{{ userAllData.userWallet }}</p>
        <p>送る金額</p>
        <p class="errmessage" v-show="walletError">ウォレットが足りません</p>
        <input type="number" class="senddisplay" v-model="walletValue" />
        <div id="sendcontentfooter">
          <button
            class="button is-danger sendclosebutton"
            v-on:click="closeSendModal"
          >
            送信
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'dashboard',
  beforeRouteEnter(to, form, next) {
    next((vm) => {
      if (!vm.$store.getters.logOnUser.userInfo.userName) {
        alert('ログイン情報がありません。');
        next('/login');
      }
    });
  },
  data() {
    return {
      showContent: false,
      userAllData: {},
      otherUsers: [],
      dialogName: '',
      dialogWallet: '',
      sendContent: false,
      walletValue: '',
      walletError: false,
      selectUser: {},
    };
  },
  created() {
    const userData = this.$store.getters.logOnUser;
    this.userAllData = userData.userInfo;
    this.otherUsers = userData.otherUsers;
  },
  methods: {
    logoutUser() {
      this.$store.dispatch({
        type: 'commitLoginUser',
        dataUserkey: this.userAllData.userKey,
      });
      this.$router.push({ path: '/login' });
    },
    openShowModal(otherUser) {
      this.showContent = true;
      this.dialogName = otherUser.userName;
      this.dialogWallet = otherUser.userWallet;
    },
    closeShowModal() {
      this.showContent = false;
    },
    openSendModal(otherUser) {
      this.walletValue = '';
      this.sendContent = true;
      this.selectUser = otherUser;
    },
    closeSendModal: async function () {
      if (this.userAllData.userWallet < this.walletValue) {
        this.walletError = true;
        return;
      } else {
        this.sendContent = false;
        this.walletError = false;
        console.log(this.userAllData, this.selectUser);
        await this.$store.dispatch({
          //送金処理
          type: 'sendWallet',
          sendUser: this.userAllData,
          receiveUser: this.selectUser,
          sendWallet: this.walletValue,
        });
        if (this.$store.getters.resultSendWallet.errorFlag) {
          alert('送金エラー');
          return;
        } else {
          this.userAllData.userWallet = this.$store.getters.resultSendWallet.changeUserWallet;
          this.selectUser.userWallet = this.$store.getters.resultSendWallet.changeOtherUserWallet;
        }
      }
    },
  },
};
</script>
<style>
h1 {
  font-weight: normal;
}
.textclick {
  line-height: 1em;
}
.userinfo {
  width: 400px;
  height: 25px;
  display: flex;
  justify-content: space-between;
  margin-right: 20px;
}
.userwidth {
  text-align: left;
  width: 300px;
  line-height: 30px;
}
.walletbutton {
  height: 30px;
  width: 120px;
  font-weight: medium;
  margin-right: 2px;
}
.sendbutton {
  height: 30px;
  width: 50px;
  font-weight: medium;
}
tr {
  height: 33px;
}
.logout {
  height: 25px;
}
.welcome {
  display: flex;
  justify-content: center;
  margin: 50px 0;
}
#overlay {
  z-index: 1;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
}
#content {
  z-index: 2;
  position: fixed;
  top: 50%;
  left: 50%;
  border-radius: 5px;
  width: 200px;
  height: 150px;
  padding: 1em;
  background: #fff;
  margin-left: -100px;
  margin-top: -75px;
}
#contentfooter {
  border-radius: 2px;
  z-index: 2;
  width: 200px;
  height: 50px;
  padding: 1em;
  background: rgba(0, 0, 0, 0.4);
  position: absolute;
  top: 100px;
  left: 0px;
}
#sendcontent {
  z-index: 2;
  position: fixed;
  top: 50%;
  left: 50%;
  border-radius: 5px;
  width: 250px;
  height: 175px;
  padding: 1em;
  background: #fff;
  margin-left: -125px;
  margin-top: -75px;
}
#sendcontentfooter {
  border-radius: 2px;
  z-index: 2;
  width: 250px;
  height: 50px;
  padding: 1em;
  background: rgba(0, 0, 0, 0.4);
  position: absolute;
  top: 125px;
  left: 0px;
}
.closebutton {
  height: 25px;
  width: 50px;
  font-size: 14px;
  margin-left: 110px;
}
.sendclosebutton {
  height: 25px;
  width: 50px;
  font-size: 14px;
  margin-left: 160px;
}
.walletdisplay {
  margin-top: 20px;
}
.senddisplay {
  margin-top: 10px;
  margin-bottom: 10px;
  width: 220px;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.trans-enter-active {
  transition: all 0.3s ease;
}
.trans-leave-active {
  transition: all 0.8s cubic-bezier(0.5, 1, 1, 0.8);
}
.trans-enter, .trans-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateY(30px);
  opacity: 0;
}
.errmessage {
  color: red;
}
</style>