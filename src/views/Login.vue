<template>
  <div class="login">
    <img alt="Vue logo" src="../assets/logo.png" />
    <h3 class="subtitle is-3">ログイン画面</h3>
    <p class="has-text-danger" v-if="errMessage">
      メールアドレス,又はパスワードが違います。
    </p>
    <p class="has-text-link" v-if="okMessage">ログインします。</p>
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
              v-model="email"
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
              v-model="password"
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
      email: '',
      password: '',
      errMessage: false,
      okMessage: false,
    };
  },
  methods: {
    loginUserData() {
      this.$store
        .dispatch({
          type: 'onLoadData',
        })
        .then(() => {
          const checkUserResult = this.$store.getters.checkUserData(
            this.email,
            this.password
          );
          if (checkUserResult.loginResult) {
            this.okMessage = true;
            this.errMessage = false;
            this.$store.dispatch({
              type: 'commitLoginUser',
              dataUserkey: checkUserResult.loginResult,
            });
            this.$router.push({ path: '/dashboard' });
          } else {
            this.okMessage = false;
            this.errMessage = true;
          }
        })
        .catch((e) => console.error(e));
    },
  },
};
</script>
<style>
h1 {
  font-weight: normal;
}
table {
  margin: 40px auto 40px;
  font-weight: bold;
}
.textclick {
  line-height: 1em;
}
</style>