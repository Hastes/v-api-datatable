<template lang="pug">
  .table-search
    slot(name="search-fields" :searchKeys="searchKeys" :runSearch="runSearch")

    .d-flex.mt-2.mb-2
      slot(name="search-actions" v-bind:runSearch="runSearch")
        template(v-if="!hideSearchActions")
          v-btn.mr-2(color="primary" depressed small @click="runSearch")
            | Найти

          v-btn(@click="clearSearch" depressed small icon)
            v-icon(small) mdi-cached
      v-spacer
      slot(name="settings")
</template>

<script>
export default {
  name: 'TableSearch',
  props: {
    hideSearchActions: { type: Boolean, default: false },
    searchKeys: { type: Object, default: () => ({}) },
  },
  data: () => ({
    isExpandOpened: false,
  }),
  created() {
    /**
     * Поиск по клику Enter и
     * если задан как минимум один ключ для поиска
     */
    window.addEventListener('keyup', (e) => {
      if (Object.entries(this.searchKeys).length && e.keyCode === 13) {
        this.runSearch();
      }
    });
  },
  methods: {
    clearSearch() {
      this.$emit('clear', {});
    },
    runSearch() {
      // копировать объект для последующего изменения
      // удалить поля с пустыми ключами
      const keys = { ...this.searchKeys };
      Object.keys(keys).forEach((key) => keys[key] === '' && delete keys[key]);
      this.$emit('search', keys);
    },
  },
};
</script>

<style lang="scss" scoped>
.v-input .v-label {
  font-weight: normal;
}
</style>
