import Vue from 'vue';
import { VueConstructor } from 'vue/types';
import {
  VMenu,
  VList,
  VListItem,
  VListItemContent,
  VListItemAction,
  VSubheader,
  VDataTable,
  VCard,
  VCardText,
  VCardTitle,
  VCardActions,
  VBtn,
  VDialog,
  VIcon,
  VSkeletonLoader,
  VCheckbox,
  VListItemTitle,
  VSpacer,
} from 'vuetify/lib';

import VAD from './VApiDatatable/index.vue';
import VCD from './VCrudDatatable/index.vue';

import { REGISTRATION_PROPS, REGISTRATION_CRUD_PROPS } from './constants';

import { DatatablePluginOptions } from './types';

Vue.component('VDataTable', VDataTable);
Vue.component('VCard', VCard);
Vue.component('VCardText', VCardText);
Vue.component('VCardActions', VCardActions);
Vue.component('VBtn', VBtn);
Vue.component('VDialog', VDialog);
Vue.component('VIcon', VIcon);
Vue.component('VMenu', VMenu);
Vue.component('VList', VList);
Vue.component('VListItem', VListItem);
Vue.component('VSkeletonLoader', VSkeletonLoader);
Vue.component('VCardTitle', VCardTitle);
Vue.component('VListItemContent', VListItemContent);
Vue.component('VListItemAction', VListItemAction);
Vue.component('VSubheader', VSubheader);
Vue.component('VCheckbox', VCheckbox);
Vue.component('VListItemTitle', VListItemTitle);
Vue.component('VSpacer', VSpacer);

const makeProps = (
  options: DatatablePluginOptions,
  availableProps: typeof REGISTRATION_PROPS & typeof REGISTRATION_CRUD_PROPS,
) =>
  Object.entries(options).reduce((acc, [key, value]) => {
    if (!availableProps[key as keyof DatatablePluginOptions]) return acc;
    return {
      ...acc,
      [key]: {
        ...availableProps[key as keyof DatatablePluginOptions],
        default: value,
      },
    };
  }, {});

export class VFetchDatatablePlguin {
  public install(
    Vue: VueConstructor,
    options: DatatablePluginOptions = {},
  ): void {
    const availableProps = {
      ...REGISTRATION_PROPS,
      ...REGISTRATION_CRUD_PROPS,
    };
    const extraProps = makeProps(options, availableProps);

    Vue.component('VCrudDatatable', {
      extends: VCD,
      props: extraProps,
    });

    Vue.component('VApiDatatable', {
      extends: VAD,
      props: extraProps,
    });
  }
}

export const VFetchDatatable = VAD;

export default new VFetchDatatablePlguin();
