import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    editIdx: -1,
    show: 'all',
    todos: [{
      text: 'eat',
      done: false,
    }, {
      text: 'drink',
      done: false,
    }, {
      text: 'sleep',
      done: false,
    },],
  },
  mutations: {
    addTodo(state, todo) {
      state.todos.push(todo)
    },
    edit(state, idx) {
      state.editIdx = idx
    },
    toggleState(state, category) {
      state.show = category
    },
    deleteTodo(state, idx) {
      state.todos.splice(idx, 1)
    },
    todoCategory(state, idx) {
      state.todos[idx].done = !state.todos[idx].done
    },
    showChange(state, category) {
      state.show = category
    }
  },
  actions: {},
  modules: {},
});
