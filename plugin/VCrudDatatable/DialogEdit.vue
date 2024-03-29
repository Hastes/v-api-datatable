<template lang="pug">
  v-dialog(
    v-bind="{ ...defaultDialogProps, ...dialogProps }"
    :value="value"
    @input="$emit('input', $event)"
    @click:outside="close"
  )
    validation-observer(
      slim
      ref="obs"
      v-slot="{ invalid, handleSubmit, reset }"
    )
      v-card.d-flex.flex-column(width="100%" height="initial")
        v-card-title.headline {{ instance ? 'Редактирование' : 'Создание' }}
          v-spacer
          v-btn(@click="close" icon)
            v-icon mdi-close

        v-card-text.flex-grow-1.py-4
          template(v-for="header in filteredHeaders")
            validation-provider(
              :key="header.value"
              :name="header.text"
              :rules="header.rules"
              :vid="header.value"
              v-slot="{ errors, valid }"
            )
              component(
                v-model="editItem[header.value]"
                v-bind="header.props"
                v-on="header.listeners ? header.listeners(editItem) : {}"
                :is="header.component"
                :label="header.text"
                :error-messages="errors"
              )
        .my-3
        v-card-actions
          v-spacer
          v-btn(
            depressed
            color="success"
            :loading="loading"
            @click="handleSubmit(save)"
          ) {{ instance ? 'Обновить' : 'Сохранить' }}

          v-btn(
            text
            @click="close"
          ) Отменить
</template>

<script>
import { ValidationObserver, ValidationProvider } from 'vee-validate';

import { REGISTRATION_CRUD_PROPS } from '../constants.ts';

export default {
  components: {
    ValidationObserver,
    ValidationProvider,
  },
  props: {
    value: { type: Boolean, default: false },
    instance: { type: Object, default: null },
    headers: { type: Array, required: true },
    methodCreate: { type: Function, default: null },
    methodUpdate: { type: Function, default: null },
    // Before save data serialize
    serializeData: { type: Function, default: (data) => data },
    dialogProps: { type: Object, default: () => ({}) },

    ...REGISTRATION_CRUD_PROPS,
  },
  data: () => ({
    loading: false,
    editItem: {},
    form: false,
    defaultDialogProps: {
      width: '600',
    },
  }),
  computed: {
    filteredHeaders() {
      return this.headers.filter((i) => {
        if (i.hiddenForEdit) return i.hiddenForEdit === !this.instance;
        return true;
      });
    },
  },
  watch: {
    instance() {
      this.init();
    },
    editItem: {
      handler(val) {
        this.$emit('edit', val);
      },
      deep: true,
    },
  },
  methods: {
    init() {
      this.editItem = { ...this.instance };
    },
    close() {
      this.$emit('input', false);
      this.init();
    },
    getMode() {
      if (this.instance)
        return {
          method: this.methodUpdate,
          args: [this.instance.id],
          data: this.serializeData(this.editItem),
          successCallback: () => this.$emit('updated'),
        };
      return {
        method: this.methodCreate,
        args: [],
        data: this.serializeData(this.editItem),
        successCallback: () => this.$emit('created'),
      };
    },
    async save() {
      this.loading = true;

      const mode = this.getMode();
      const attrs = {
        args: mode.args,
        data: mode.data,
        obs: this.$refs.obs,
      };

      const resp = await this.preSave(mode.method, attrs);

      if (!(resp instanceof Error)) {
        mode.successCallback();
        this.close();
      }
      this.loading = false;
    },
  },
};
</script>
