import Vue from 'vue';
import { VNode } from 'vue/types';

import vuetify from './plugins/vuetify';
import { DatatablePluginOptions } from '../plugin/types';
// import VApiDatatable from '../lib/v-api-datatable.umd.js';
import VApiDatatable from '../plugin/index';

import App from './App.vue';

Vue.config.productionTip = false;

const options: DatatablePluginOptions = {
  getData: (resp) => {
    return resp.json();
  },
  getItems: (resp) => {
    return resp.data;
  },
  getTotalItems: (data) => {
    return data.total;
  },
  getPerPage: (data) => {
    return data.per_page;
  },
  preSave: (method, args) => {
    return method(args);
  },
};

Vue.use(VApiDatatable, options);

new Vue({
  vuetify,
  render: (h): VNode => h(App),
}).$mount('#app');
