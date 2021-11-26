import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

import { VueConstructor } from 'vue/types';

import VFD from './components/VApiDatatable/index.vue';
import VCD from './components/VCrudDatatable/index.vue';

import { REGISTRATION_PROPS, REGISTRATION_CRUD_PROPS } from './constants';
import { DatatablePluginOptions } from './components/types';

Vue.use(Vuetify);

export class VFetchDatatablePlguin {
  public install(Vue: VueConstructor, options: DatatablePluginOptions = {}) {
    const availableProps = {
      ...REGISTRATION_PROPS,
      ...REGISTRATION_CRUD_PROPS,
    };
    const extraProps = Object.entries(options).reduce((acc, [key, value]) => {
      return {
        ...acc,
        [key]: {
          ...availableProps[key as keyof DatatablePluginOptions],
          default: value,
        },
      };
    }, {});

    const ExtraVFD = Vue.extend({
      extends: VFD,
      props: extraProps,
    });
    Vue.component('VCrudDatatable', VCD);
    Vue.component('VApiDatatable', ExtraVFD);
  }
}

export const VFetchDatatable = VFD;

export default new VFetchDatatablePlguin();
