<template lang="pug">
  .table-search.d-flex.align-center.px-2.pt-2
    slot(name="search-field" v-bind="{ searchKeys, runSearch }")
      v-text-field(
        dense
        solo
        flat
        hide-details
        label="Search"
        color="grey darken-1"
        background-color="grey lighten-3"
      )
        template(v-slot:prepend-inner)
          v-btn(icon).mr-2
            v-icon mdi-magnify

    .ml-2
      slot(name="settings")
</template>

<script>
export default {
  name: 'TableSearch',
  props: {
    hideSearchActions: { type: Boolean, default: false },
    searchKeys: { type: Object, default: () => ({}) },
  },
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
