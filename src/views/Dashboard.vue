<template>
  <div class="dashboard">
    <img alt="Vue logo" src="../assets/logo.png" />
    <div class="welcome">
      <div class="userinfo">
        <p class="subtitle is-5">{{ user }}さんようこそ！！</p>
        <p class="subtitle is-5">残高:{{ wallet }}</p>
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
                v-on:click="openModal(otherUser)"
                class="button is-focused is-info is-size-6 walletbutton"
              >
                walletを見る
              </button>
            </div>
          </td>
          <td>
            <div class="buttons">
              <button class="sendbutton button is-focused is-info is-size-6">
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
          <button class="button is-danger closebutton" v-on:click="closeModal">
            close
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
      if (!vm.$store.getters.logOnUser.userName) {
        alert('ログイン情報がありません。');
        next('/login');
      }
    });
  },
  data() {
    return {
      user: '',
      wallet: '',
      showContent: false,
      otherUsers: [],
      dialogName: '',
      dialogWallet: '',
    };
  },
  mounted() {
    const userData = this.$store.getters.logOnUser;
    this.user = userData.userName;
    this.wallet = userData.userWallet;
    this.otherUsers = userData.otherUsers;
  },
  methods: {
    logoutUser() {
      this.$store.dispatch({
        type: 'commitLoginUser',
        dataUserkey: this.$store.getters.logOnUser.userkey,
      });
      this.$router.push({ path: '/login' });
    },
    openModal(otherUser) {
      this.showContent = true;
      this.dialogName = otherUser.userName;
      this.dialogWallet = otherUser.userWallet;
    },
    closeModal() {
      this.showContent = false;
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
.closebutton {
  height: 25px;
  width: 50px;
  font-size: 14px;
  margin-left: 110px;
}
.walletdisplay {
  margin-top: 20px;
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
</style>