import Vue from 'vue';
import VueI18n from 'vue-i18n';
import VueClipboard2 from 'vue-clipboard2';

import KeenUI from 'keen-ui';
import VTooltip from 'v-tooltip';
import VueJsModal from 'vue-js-modal';
import { Swiper as SwiperClass, Pagination, Navigation, Mousewheel, Autoplay } from 'swiper/swiper.esm';
import VueAwesomeSwiper from 'vue-awesome-swiper';
import TrendChart from 'vue-trend-chart';

import 'animate.css';
import 'keen-ui/dist/keen-ui.css';
import 'swiper/swiper-bundle.css';

import App from '@/App.vue';
import router from '@/router';
import store from '@/store';

import LuxonPlugin from '@/plugins/LuxonPlugin';
import RequestPlugin from '@/plugins/RequestPlugin';
import WalletPlugin from '@/plugins/WalletPlugin';
import RequestTxPlugin from '@/plugins/RequestTxPlugin';
import BigNumberPlugin from '@/plugins/BigNumberPlugin';

import ModalMixin from '@/mixins/common/ModalMixin';
import GlobalValueMixin from '@/mixins/common/GlobalValueMixin';

import { isAndroid, isIOS, addComma } from '@/utils/common';

import CommonLoader from '@/components/common/CommonLoader';
import VueKakaoSdk from 'vue-kakao-sdk';

Vue.config.productionTip = false;

window.Log = (...args) => {
  if (process.env.VUE_APP_PROFILE !== 'live') {
    console.log(...args);
  }
};

export const getFileURL = (path) => {
  const publicPath = process.env.VUE_APP_PUBLIC_PATH;
  const prefix = publicPath === '/' ? '/static/' : publicPath;

  return prefix + (path.slice(0, 1) === '/' ? path.slice(1, path.length) : path);
};

export const createBemClassName = (base, children = [], states = []) => {
  let result = base;

  for (const child of children) {
    result += ` ${base}__${child}`;
  }

  for (const state of states) {
    // IOS Flag
    if (state === 'ios' && !isIOS()) {
      continue;
    }

    // Android Flag
    if (state === 'android' && isAndroid()) {
      continue;
    }

    result += ` ${base}--${state}`;
  }

  return result;
};

// swiper 6.x 버전으로 넘어오면서 생긴 변화
SwiperClass.use([Pagination, Mousewheel, Navigation, Autoplay]);

Vue.use(VueI18n);
Vue.use(VueAwesomeSwiper);
Vue.use(VueJsModal, {
  dialog: true,
  dynamic: true,
});
Vue.use(VueClipboard2);
Vue.use(KeenUI);
Vue.use(VTooltip);
Vue.use(TrendChart);
Vue.use(VueKakaoSdk, { apiKey: process.env.VUE_APP_KAKAO_WEB_KEY });

Vue.mixin(GlobalValueMixin);
Vue.mixin(ModalMixin);

Vue.prototype.$eventBus = new Vue();
Vue.prototype.$bem = createBemClassName;
Vue.prototype.$static = {
  getFileURL,
};
Vue.prototype.$date = new LuxonPlugin();
Vue.prototype.$http = new RequestPlugin();
Vue.prototype.$wallet = new WalletPlugin();
Vue.prototype.$tx = new RequestTxPlugin({
  wallet: Vue.prototype.$wallet,
});
Vue.prototype.$bn = new BigNumberPlugin();

Vue.filter('addComma', addComma);
Vue.filter('formatDate', Vue.prototype.$date.formatDate);

Vue.component('common-loader', CommonLoader);

async function initApp() {
  const i18n = await require('./translation').default();

  const VueRoot = new Vue({
    store,
    router,
    render: (h) => h(App),
    i18n,
  });

  store.$app = VueRoot;
  VueRoot.$mount('#app');

  // 원활한 테스트를 위한 Store 오픈, dev 환경에서만
  if (process.env.VUE_APP_PROFILE === 'dev') {
    window.$store = require('@/store/index').default;
  }
}

initApp();
