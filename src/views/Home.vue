<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <h3 class="subtitle is-3">新規登録画面</h3>
    <p class="has-text-danger" v-if="errMessage">
      メールアドレスが既に登録ずみです。
    </p>
    <table>
      <tbody>
        <tr>
          <td>
            <label for="username">ユーザ名</label>
          </td>
          <td>
            <input
              type="text"
              name="username"
              placeholder="userName"
              v-model="username"
            />
          </td>
        </tr>
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
    <button class="button is-link is-outlined" @click="actionInputData()">
      新規登録
    </button>
    <div class="textclick">
      <router-link to="/login" class="is-size-7">
        ログインはこちらから
      </router-link>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Home',
  data() {
    return {
      username: '',
      email: '',
      password: '',
      errMessage: false,
    };
  },
  methods: {
    actionInputData() {
      this.$store
        .dispatch({
          type: 'onLoadData',
        })
        .then(() => {
          const checkUserDatas = this.$store.getters.checkUserData(
            this.email,
            this.password
          );
          if (!checkUserDatas.emailResult) {
            this.errMessage = false;
            this.$store.dispatch({
              type: 'addInputData',
              dataName: this.username,
              dataEmail: this.email,
              dataPassword: this.password,
            });
          } else {
            this.errMessage = true;
            return;
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
  margin: 60px auto 40px;
  font-weight: bold;
}
.textclick {
  line-height: 1em;
}
</style>