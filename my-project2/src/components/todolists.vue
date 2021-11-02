<template>
  <div>
    <div v-for="(item, idx) in lists" :key="idx">
      <input type="checkbox" :checked="item.done" @click="todoCategory(idx)" />
      <span>{{ item.text }}</span
      ><button @click="deletetodo(idx)">delete</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "todolists",
  data() {
    return {};
  },
  computed: {
    lists() {
      let category = this.$store.state.show;
      if (category === "completed") {
        return this.$store.state.todos.filter((it) => it.done);
      } else if (category === "uncompleted") {
        return this.$store.state.todos.filter((it) => !it.done);
      } else {
        return this.$store.state.todos;
      }
    },
  },
  methods: {
    deletetodo(idx) {
      this.$store.commit("deleteTodo", idx);
    },
    todoCategory(idx) {
      this.$store.commit("todoCategory", idx);
    },
  },
};
</script>