import Vue from "vue";
// import App from "./App.vue";
import store from "./store";
import todos from './components/todos.vue'
import route from './router.js'
console.log(route)

Vue.config.productionTip = false;

new Vue({
  store,
  router: route,
  render: (h) => h(todos),
}).$mount("#app");
