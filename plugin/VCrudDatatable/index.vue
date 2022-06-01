<template lang="pug">
  .v-crud-datatable
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
      v-bind="$attrs"
      v-on="$listeners"
      :headers="headersTable"
      :method="methodList"
      :prettifyField="prettifyField"
      ref="apiDatatable"
    )
      template(v-slot:search-actions)
        v-btn(
          v-if="methodCreate"
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
        v-for="(_, name) in $scopedSlots"
        v-slot:[name]="data"
      )
        slot(:name="name" v-bind="data")

      template(
        v-for="(_, name) in $slots"
        :slot="name"
      )
        slot(:name="name")

</template>

<script>
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
    appendHeaders: { type: Array, default: () => [] },
    methodList: { type: Function, required: true },
    methodView: { type: Function, default: null },
    methodCreate: { type: Function, default: null },
    methodUpdate: { type: Function, default: null },
    methodDelete: { type: Function, default: null },
    prettifyField: { type: Function, default: (item, key) => item[key] },
    // Before save data serialize
    serializeData: { type: Function, default: (data) => data },
    // After instance load data serialize
    serializeInstanceData: { type: Function, default: (data) => data },

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
      let appendHeadersTable = this.appendHeaders.filter((i) => !i.hiddenForTable);

      if (this.methodUpdate || this.methodDelete) {
        headersTable = [
          ...headersTable,
          {
            text: 'Действия',
            value: 'actions',
            sortable: false,
            class: 'table-col-autowidth',
          },
          ...appendHeadersTable,
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

<style lang="scss">
.table-col-autowidth {
  width: 1px;
  min-width: 1px;
}
</style>
