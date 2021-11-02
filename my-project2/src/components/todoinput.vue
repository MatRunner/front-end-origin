<template>
  <div>
    <input type="checkbox" :checked="allChecked" />
    <input type="text" @keyup.enter="addTodo" />
  </div>
</template>

<script>
export default {
  name: "todoinput",
  data() {
    return {};
  },
  computed: {
    allChecked() {
      return this.$store.state.todos.every((it) => it.done);
    },
  },
  methods: {
    addTodo(e) {
      let content = e.target.value;
      this.$store.commit("addTodo", {
        text: content,
        done: false,
      });
      e.target.value = "";
    },
  },
};
</script>