import Vue from 'vue'
import App from './App.vue'

import VueRouter from 'vue-router'
import ElementUi from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'


import axios from 'axios';
Vue.prototype.$axios = axios;
Vue.prototype.$axios.defaults.baseURL = "http://127.0.0.1:7777";
import qs from 'qs';
Vue.prototype.$qs = qs;

import Web3 from 'web3';
var web3 = new Web3('http://127.0.0.1:8545');
Vue.prototype.$web3 = web3;


import Global from './store/Global.js'
Vue.prototype.$Global = Global;


import routerConfig from './router.config.js'
Vue.use(ElementUi)
Vue.use(VueRouter)
Vue.config.productionTip = false

const router = new VueRouter(routerConfig)
new Vue({
	router,
  render: h => h(App),
}).$mount('#app')
