<template>
  <div>
    <todoinput></todoinput>
    <todolists></todolists>
    <todocategory></todocategory>
    <router-link to="/foo/">foo</router-link>
    <br />
    <router-link to="/bar/">bar</router-link>
    <router-view></router-view>
  </div>
</template>

<script>
import todoinput from "./todoinput.vue";
import todolists from "./todolists.vue";
import todocategory from "./todocategory.vue";
export default {
  name: "todos",
  components: {
    todoinput,
    todolists,
    todocategory,
  },
};
</script>