import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import './filters'

// Element
import ElementUI from 'element-ui';
import locale from 'element-ui/lib/locale/lang/en'
import 'element-ui/lib/theme-chalk/index.css';

import "./styles/global.scss";

Vue.config.productionTip = false
Vue.use(ElementUI, { locale });

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
