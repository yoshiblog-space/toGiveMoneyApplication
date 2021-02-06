<template>
  <div id="app">
    <router-view />
    <footer class="footerbox">
      <div class="content has-text-centered">
        <p>Copyright @2019 oo Inc All rights reserved</p>
      </div>
    </footer>
  </div>
</template>

<style lang="scss">
@import "../node_modules/bulma/bulma.sass";
#app {
  font-family: "ヒラギノ丸ゴ ProN", "Hiragino Maru Gothic ProN", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.footerbox {
  margin: 50px auto;
}
</style>
