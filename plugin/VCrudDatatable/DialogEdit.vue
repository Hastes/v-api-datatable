<template lang="pug">
  v-dialog(
    :value="value"
    @input="$emit('input', $event)"
    min-width="600"
  )
    validation-observer(ref="obs" v-slot="{ invalid, handleSubmit }")

      v-card
        v-card-title.headline {{ instance ? 'Редактирование' : 'Создание' }}
          v-spacer
          v-btn(@click="close" icon)
            v-icon mdi-close

        v-card-text.py-4
          template(v-for="header in headers")
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
    // Декоратор данных перед отправкой
    serializeData: { type: Function, default: (data) => data },

    ...REGISTRATION_CRUD_PROPS,
  },
  data: () => ({
    loading: false,
    editItem: {},
    form: false,
  }),
  watch: {
    instance() {
      this.init();
    },
  },
  methods: {
    init() {
      this.editItem = { ...this.instance };
    },
    close() {
      this.$emit('input', false);
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
