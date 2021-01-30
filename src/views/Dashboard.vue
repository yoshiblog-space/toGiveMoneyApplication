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
        <tr>
          <td class="userwidth has-text-left is-size-6 has-text-weight-light">
            テストユーザー
          </td>
          <td>
            <div class="buttons">
              <button class="button is-focused is-info is-size-6 walletbutton">
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
        <tr>
          <td class="userwidth has-text-left is-size-6 has-text-weight-light">
            テストユーザー
          </td>
          <td>
            <div class="buttons">
              <button class="walletbutton button is-focused is-info is-size-6">
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
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "dashboard",
  beforeRouteEnter(to, form, next) {
    next((vm) => {
      if (!vm.$store.getters.logOnUser.userName) {
        alert("ログイン情報がありません。");
        next("/login");
      }
    });
  },
  data() {
    return {
      user: "",
      wallet: "",
    };
  },
  mounted() {
    const userData = this.$store.getters.logOnUser;
    this.user = userData.userName;
    this.wallet = userData.userWallet;
  },
  methods: {
    logoutUser() {
      this.$store.dispatch({
        type: "commitLoginUser",
        dataUserkey: this.$store.getters.logOnUser.userkey,
      });
      this.$router.push({ path: "/login" });
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
</style>