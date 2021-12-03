<template lang="pug">
  .smart-crud-table
    dialog-delete(
      v-if="methodDelete"
      :value="deletion"
      :method="methodDelete"
      @close="deletion=null"
      @done="itemDeleted"
    )
    dialog-edit(
      v-model="editDialog.value"
      :instance="editDialog.instance"
      :headers="headersForm"
      :method-update="methodUpdate"
      :method-create="methodCreate"
      :serialize-data="serializeData"
      :pre-save="preSave"
      @created="itemCreated"
      @updated="itemUpdated"
    )
    v-api-datatable(
      :headers="headersTable"
      :method="methodList"
      :prettifyField="prettifyField"
      ref="apiDatatable"
    )
      template(v-slot:search-actions)
        v-btn(
          small
          color="primary"
          depressed
          @click="openEditDialog()"
        )
          v-icon mdi-plus
          | Добавить

      template(v-slot:item.actions="{ item }")
        .d-flex
          slot(name="item.actions.extra" v-bind="{ item }")
          v-btn.mr-1(
            v-if="methodUpdate"
            fab
            x-small
            depressed
            @click="openEditDialog(item)"
          )
            v-icon mdi-pencil
          v-btn(
            v-if="methodDelete"
            color="error"
            fab
            x-small
            depressed
            @click="deletion = item"
          )
            v-icon mdi-delete

      template(
        v-for="header in headers"
        v-slot:[`item.${header.value}`]="props"
      )
        slot(:name="`item.${header.value}`" v-bind="props")

      template(
        v-for="header in headers"
        v-slot:[`header.${header.value}`]="props"
      )
        slot(
          v-if="$scopedSlots[`header.${header.value}`]"
          :name="`header.${header.value}`"
          v-bind="props"
        )
        span(v-else) {{ header.text }}

</template>

<script lang="ts">
import Vue from 'vue';

import DialogDelete from './DialogDelete.vue';
import DialogEdit from './DialogEdit.vue';

import { REGISTRATION_CRUD_PROPS } from '../constants';

Vue.component('DialogEdit', {
  extends: DialogEdit,
  props: REGISTRATION_CRUD_PROPS,
});

export default Vue.extend({
  components: {
    DialogDelete,
  },
  props: {
    /*
     * Array<{
     *  text: string,
     *  value: string,
     *  hiddenForTable?: boolean,
     *  hiddenForForm?: boolean,
     *  component: [object, string],
     *  props?: [object]
     * }>
     */
    headers: { type: Array, default: () => [] },
    methodList: { type: Function, required: true },
    methodView: { type: Function, default: null },
    methodCreate: { type: Function, default: null },
    methodUpdate: { type: Function, default: null },
    methodDelete: { type: Function, default: null },
    prettifyField: {
      type: Function,
      default: (item: { [x: string]: any }, key: string | number) => item[key],
    },
    // Before save data serialize
    serializeData: { type: Function, default: (data: any) => data },
    // After instance load data serialize
    serializeInstanceData: { type: Function, default: (data: any) => data },

    ...REGISTRATION_CRUD_PROPS,
  },
  data: () => ({
    deletion: null,
    editDialog: {
      value: false,
      instance: null,
    },
  }),
  computed: {
    headersTable() {
      let headersTable = this.headers.filter((i) => !i.hiddenForTable);
      if (this.methodUpdate || this.methodDelete) {
        headersTable = [
          ...headersTable,
          {
            text: 'Действия',
            value: 'actions',
            sortable: false,
          },
        ];
      }
      return headersTable;
    },
    headersForm() {
      return this.headers.filter((i) => !i.hiddenForForm);
    },
  },
  methods: {
    itemDeleted() {
      this.$emit('item:deleted');
      this.refreshSmartTable();
    },
    itemUpdated() {
      this.$emit('item:updated');
      this.refreshSmartTable();
    },
    itemCreated() {
      this.$emit('item:created');
      this.refreshSmartTable();
    },
    refreshSmartTable() {
      this.$refs.apiDatatable.refresh();
    },
    openEditDialog(item = null) {
      this.editDialog.value = true;
      this.editDialog.instance = this.serializeInstanceData(item);
    },
  },
});
</script>
