<template lang="pug">
  v-dialog(
    :value="value"
    @click:outside="close"
    min-width="600"
  )
    v-card
      v-card-title.headline Подтверждение удаления
        v-spacer
        v-btn(@click="close" icon)
          v-icon mdi-close
      v-card-text
        span Объект
        strong(v-if="value")  {{ value.name }}
        span  будет удален

      v-divider
      v-card-actions
        slot(name="actions")
          v-spacer
          v-btn(
            color="error"
            :loading="loading"
            @click="deleteItem"
            text
          ) Да
          v-btn(
            color="warning"
            @click="close"
            text
          ) Нет
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'DialogDelete',
  props: {
    value: { type: Object, default: null },
    method: { type: Function, required: true },
  },
  data: () => ({
    loading: false,
  }),
  methods: {
    close() {
      this.$emit('close');
    },
    done() {
      this.$emit('done');
      this.close();
    },
    async deleteItem() {
      this.loading = true;
      await this.method({ args: [this.value.id] });
      this.done();
      this.loading = false;
    },
  },
});
</script>
