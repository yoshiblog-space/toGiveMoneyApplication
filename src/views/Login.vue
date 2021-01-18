<template>
  <div class="login">
    <img alt="Vue logo" src="../assets/logo.png" />
    <h3 class="subtitle is-3">ログイン画面</h3>
    <table>
      <tbody>
        <tr>
          <td>
            <label for="email">メールアドレス</label>
          </td>
          <td>
            <input
              type="text"
              name="email"
              placeholder="E-Mail"
              v-model="loginEmail"
            />
          </td>
        </tr>
        <tr>
          <td>
            <label for="password">パスワード</label>
          </td>
          <td>
            <input
              type="text"
              name="username"
              placeholder="Password"
              v-model="loginPassword"
            />
          </td>
        </tr>
      </tbody>
    </table>
    <button class="button is-link is-outlined" @click="loginUserData()">
      ログイン
    </button>
    <div class="textclick">
      <router-link to="/" class="is-size-7"> 新規登録はこちらから </router-link>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Login',
  data() {
    return {
      loginEmail: '',
      loginPassword: '',
    };
  },
  created: function () {
    this.$store.dispatch({
      type: 'onLoadData',
    });
  },
  methods: {
    loginUserData() {
      const checkUserDatas = this.$store.state.userInfo;
      let userCheckFlag = 0;
      checkUserDatas.forEach((checkUserData) => {
        if (checkUserData.userEmail === this.loginEmail) {
          if (checkUserData.userPassword === this.loginPassword) {
            alert('ログインできました！');
            userCheckFlag = 1;
          } else {
            alert('パスワードが異なります');
          }
        }
      });
      if (!userCheckFlag) {
        alert('該当ユーザがいません');
      }
    },
  },
};
</script>
<style>
h1 {
  font-weight: normal;
}
table {
  margin: 60px auto 40px;
  font-weight: bold;
}
.textclick {
  line-height: 1em;
}
</style>