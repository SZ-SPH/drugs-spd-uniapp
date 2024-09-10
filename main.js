import App from './App'
import uviewPlus from '@/uni_modules/uview-plus'
import {
  createUnistorage
} from '@/uni_modules/pinia-plugin-unistorage/index.js'

import plugins from './plugins'
import './permission'
import * as Pinia from 'pinia';
import {
  getDicts
} from './api/common.js'

import {
  addDateRange
} from '@/utils/common.js'
// #ifdef H5
// signalr
import signalR from '@/signalr/signalr.js'
// #endif
// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'

try {

  const app = new Vue({
    ...App
  })
  app.$mount()
  // #endif

  import {
    createSSRApp
  } from 'vue'
  export function createApp() {
    const app = createSSRApp(App)

    app.config.globalProperties.getDicts = getDicts
    app.config.globalProperties.addDateRange = addDateRange
    app.use(uviewPlus)
    app.use(plugins)
    const store = Pinia.createPinia()
    // 持久化存储
    store.use(createUnistorage())
    app.use(store)

    // #ifdef H5
    signalR.init('/msgHub');
    app.config.globalProperties.signalr = signalR
    // #endif

    return {
      app,
      Pinia
    }
  }
