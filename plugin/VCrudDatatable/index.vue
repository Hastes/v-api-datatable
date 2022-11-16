<template lang="pug">
  .v-crud-datatable
    dialog-delete(
      v-if="methodDelete"
      :value="deletion"
      :method="methodDelete"
      :dialog-props="dialogDeleteProps"
      :deletion-text-value="deletionTextValue"
      @close="deletion=null"
      @done="itemDeleted"
    )
      template(v-slot:content="props")
        slot(name="dialog-delete.content" v-bind="props")

    dialog-edit(
      v-model="editDialog.value"
      :instance="editDialog.instance"
      :headers="headersForm"
      :method-update="methodUpdate"
      :method-create="methodCreate"
      :serialize-data="serializeData"
      :dialog-props="dialogEditProps"
      :pre-save="preSave"
      @edit="itemEdit"
      @created="itemCreated"
      @updated="itemUpdated"
    )

    v-api-datatable(
      v-bind="$attrs"
      v-on="$listeners"
      :headers="headersTable"
      :method="methodList"
      :prettify-field="prettifyField"
      :search-keys-initial="searchKeysInitial"
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

      template(v-slot:item.actions="{ item, header }")
        div.d-flex(:class="header.cellClass")
          slot(name="item.actions.extra" v-bind="{ item }")
          v-btn.mr-1(
            v-if="methodUpdate"
            fab
            x-small
            depressed
            @click="header.editItem(item)"
          )
            v-icon mdi-pencil
          v-btn(
            v-if="methodDelete"
            color="error"
            fab
            x-small
            depressed
            @click="header.deleteItem(item)"
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

const ACTIONS_HEADER_VALUE = 'actions';

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
     *  hiddenForEdit?: boolean,
     *  component: [object, string],
     *  listeners?: function,
     *  props?: [object]
     * }>
     *
     * ? => is not required prop
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
    // Dialog props
    dialogEditProps: { type: Object, default: () => ({}) },
    dialogDeleteProps: { type: Object, default: () => ({}) },
    deletionTextValue: { type: String, default: 'name' },
    searchKeysInitial: { type: Object, default: () => ({}) },

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
      const filterHeaders = (headers) => {
        return headers.filter(
          (i) => !i.hiddenForTable && i.value !== ACTIONS_HEADER_VALUE,
        );
      };

      const headerActions = this.headers.find((i) => i.value === ACTIONS_HEADER_VALUE);
      const appendHeadersTable = filterHeaders(this.appendHeaders);
      let headersTable = filterHeaders(this.headers);

      if (this.methodUpdate || this.methodDelete) {
        headersTable = [
          ...headersTable,
          {
            // Dynamic
            text: 'Действия',
            class: 'table-col-autowidth',
            ...headerActions,

            // Static
            sortable: false,
            value: ACTIONS_HEADER_VALUE,
            deleteItem: (item) => (this.deletion = item),
            editItem: (item) => this.openEditDialog(item),
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
    itemEdit(val) {
      this.$emit('item:edit', val);
    },
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
