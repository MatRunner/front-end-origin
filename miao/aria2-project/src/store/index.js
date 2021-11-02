import Vue from "vue";
import Vuex from "vuex";
import Aria2 from '../Aria2'
import * as moment from 'moment'

Vue.use(Vuex);
const aria2=new Aria2({
  token:1234,
  port:6800,
})

export default new Vuex.Store({
  state: {
    aria2,
    timeStamp:{},
  },
  mutations: {
    recordTime(state,gid){
      let time=moment().format('YYYY-MM-DD')
      Vue.set(state.timeStamp,gid,time)
    },
  },
  actions: {
  },
  modules: {},
});
