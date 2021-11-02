import Vue from "vue";
import VueRouter from "vue-router";
import Download from '../views/Download'
import Completed from '../views/Completed'
import Recycle from '../views/Recycle'

Vue.use(VueRouter);

const routes = [
  {
    path: "/download",
    name: "download",
    component: Download,
  },
  {
    path:'/completed',
    name:'completed',
    component:Completed,
  },
  {
    path:'/recycle',
    name:'recycle',
    component:Recycle,
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
