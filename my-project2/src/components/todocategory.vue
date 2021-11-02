<template>
  <div>
    <div>
      <span>{{ todoleft }}</span> items left
    </div>
    <label>
      <input
        type="radio"
        name="category"
        @click="showchange('all')"
        checked
      />All
    </label>
    <label>
      <input
        type="radio"
        name="category"
        @click="showchange('completed')"
      />Completed
    </label>
    <label>
      <input
        type="radio"
        name="category"
        @click="showchange('uncompleted')"
      />Uncompleted
    </label>
  </div>
</template>
<script>
export default {
  name: "todocategory",
  data() {
    return {};
  },
  computed: {
    todoleft() {
      return this.$store.state.todos.filter((it) => !it.done).length;
    },
  },
  methods: {
    showchange(category) {
      this.$store.commit("showChange", category);
    },
  },
};
</script>