import Vue from 'vue';
import { VNode } from 'vue/types';

import vuetify from './plugins/vuetify';
import { DatatablePluginOptions } from '@/components/types';
import VApiDatatable from './wrapper';

import App from './App.vue';

Vue.config.productionTip = false;

const options: DatatablePluginOptions = {
  getData: async (resp) => {
    return await resp.json();
  },
  getTotalItems: (resp, data) => {
    return data.total;
  },
  getPerPage: (resp, data) => {
    return data.per_page;
  },
};

Vue.use(VApiDatatable, options);

new Vue({
  vuetify,
  render: (h): VNode => h(App),
}).$mount('#app');
