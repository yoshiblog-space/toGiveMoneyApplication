import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import firebase from "firebase/app";
// Add the Firebase services that you want to use
import "firebase/auth";
import "firebase/firestore";
import "firebase/database";

// TODO: Replace the following with your app's Firebase project configuration
// For Firebase JavaScript SDK v7.20.0 and later, `measurementId` is an optional field
var firebaseConfig = {
  apiKey: "AIzaSyAKuoaa6M9lLjJeKD_bdLmYC0j2aV9OnKY",
  authDomain: "togivemoney-beabb.firebaseapp.com",
  databaseURL: "https://togivemoney-beabb-default-rtdb.firebaseio.com",
  projectId: "togivemoney-beabb",
  storageBucket: "togivemoney-beabb.appspot.com",
  messagingSenderId: "453309912170",
  appId: "1:453309912170:web:f4bd900efeca2f1ef56613"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

Vue.config.productionTip = false;
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
