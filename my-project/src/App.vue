<template>
  <div id="app">
    <header show="fasle"></header>
  </div>
</template>

<script>
import todoHeader from "./components/header.vue";
// import test from "./components/test.vue";
export default {
  name: "App",
  components: {
    todoHeader,
  },
  data() {
    return {
      input: "",
    };
  },
};
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
