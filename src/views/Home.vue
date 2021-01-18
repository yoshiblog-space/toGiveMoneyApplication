<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <h3 class="subtitle is-3">新規登録画面</h3>
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
              v-model="inputUsername"
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
              v-model="inputEmail"
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
              v-model="inputPassword"
            />
          </td>
        </tr>
      </tbody>
    </table>
    <button
      class="button is-link is-outlined"
      @click="actionInputData(inputUsername, inputEmail, inputPassword)"
    >
      新規登録
    </button>
    <div class="textclick">
      <a href="#" class="is-size-7">ログインはこちらから</a>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Home',
  data() {
    return {
      inputUsername: '',
      inputEmail: '',
      inputPassword: '',
    };
  },
  methods: {
    actionInputData(inputUsername, inputEmail, inputPassword) {
      this.$store.dispatch({
        type: 'addInputData',
        setUsername: inputUsername,
        setEmail: inputEmail,
        setPassword: inputPassword,
      });
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