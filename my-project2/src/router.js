import Vue from 'vue'
import VueRouter from 'vue-router'
import foo from './components/foo.vue'
import bar from './components/bar.vue'
import A from './components/A.vue'
Vue.use(VueRouter)

const Router = new VueRouter({
  routes: [{
    path: '/foo',
    component: foo,
    children: [{
      path: 'a',
      component: A,
    }]
  }, {
    path: '/bar',
    component: bar,
  }]
})

export default Router