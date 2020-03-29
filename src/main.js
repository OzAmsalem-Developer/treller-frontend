import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import './filters'

import toggleButton from 'vue-js-toggle-button'
Vue.use(toggleButton)

// Element
import ElementUI from 'element-ui';
import locale from 'element-ui/lib/locale/lang/en'
import 'element-ui/lib/theme-chalk/index.css';
import VueSweetalert2 from 'vue-sweetalert2';
import "./styles/global.scss";

Vue.config.productionTip = false
Vue.use(ElementUI, { locale });
Vue.use(VueSweetalert2);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
