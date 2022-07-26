<template lang="pug">
  .v-api-datatable
    v-alert.mt-2(
      v-if="error"
      type="error"
      outlined
    ) {{ error }}

    table-search.pb-3(
      v-if="!error"
      :searchKeys="searchKeys"
      @search="loadItems"
      @clear="clearSearchKeys"
    )
      template(v-slot:search-fields="{ searchKeys, runSearch }")
        slot(name="search-fields" :searchKeys="searchKeys" :runSearch="runSearch")
      template(v-slot:expand-search-fields="{ searchKeys }")
        slot(name="expand-search-fields" :searchKeys="searchKeys")
      template(v-slot:search-actions="{ runSearch }")
        slot(name="search-actions" :runSearch="runSearch")

      template(v-slot:settings)
        table-settings(
          v-if="visibleHeaders"
          v-model="visibleHeaders"
          :headers="headers"
          :pinned-header.sync="pinnedHeader"
        )

    v-data-table(
      v-if="!error && visibleHeaders"
      loader-height="3"
      v-bind="$attrs"
      :class="{ 'pinned-first': pinnedHeader && !generalLoading }"
      :loading="generalLoading"
      :headers="visibleHeaders"
      :headersLength="headersLength"
      :items="items"
      :options.sync="pagination"
      :server-items-length="totalItems"
      :hide-default-footer="generalLoading || externalPagination"
      :show-expand="true || isVisibleExpandHeader && $attrs['show-expand']"
      @update:page="loadItems"
      @update:items-per-page="loadItems"
      @update:sort-desc="loadItems"
    )
      template(v-if="$scopedSlots.item" v-slot:item="props")
        slot(name="item" v-bind="props")

      template(
        v-for="header in visibleHeaders"
        v-slot:[`item.${header.value}`]="props"
      )
        slot(
          v-if="$scopedSlots[`item.${header.value}`]"
          :name="`item.${header.value}`"
          v-bind="props"
        )
        span(v-else) {{ prettifyField(props.item, header.value) }}

      template(
        v-for="header in visibleHeaders"
        v-slot:[`header.${header.value}`]="props"
      )
        slot(
          v-if="$scopedSlots[`header.${header.value}`]"
          :name="`header.${header.value}`"
          v-bind="props"
        )
        span(v-else) {{ header.text }}

      template(v-slot:expanded-item="{ headers, item }")
        slot(name="expanded-item" v-bind="{ headers, item }")

      template(slot="no-data")
        .text-xs-center Отсутствуют данные

      template(slot="no-results")
        .text-xs-center Не найдено подходящих данных

    .pt-4(v-if="externalPagination && items.length")
      v-pagination(
        v-model="pagination.page"
        :disabled="generalLoading"
        :length="pages"
        total-visible="10"
      )
</template>

<script>
import sum from 'hash-sum';

import TableSearch from './TableSearch.vue';
import TableSettings from './TableSettings.vue';

import { DEFAULT_PER_PAGE, REGISTRATION_PROPS } from '../constants.ts';

/*
 * props:
 *
 * method - using for every table
 * headers - [{ text, value }, {text, value }]
 * prettifyField - wrap data every item for prettify output. Attributes: item, key(value of current header)
 * externalPagination - pagination via v-pagination
 */
export default {
  name: 'VFetchDatatable',
  components: {
    TableSearch,
    TableSettings,
  },
  props: {
    method: { type: Function, required: true },
    headers: { type: Array, default: () => [] },
    prettifyField: { type: Function, default: (item, key) => item[key] },
    externalPagination: { type: Boolean, default: false },

    ...REGISTRATION_PROPS,
  },
  data: () => ({
    items: [],
    visibleHeaders: null,
    pinnedHeader: null,
    localStorageToken: null,

    loading: false,
    error: null,

    totalItems: 0,
    pagination: {
      page: 1,
      sortBy: [],
      itemsPerPage: DEFAULT_PER_PAGE,
    },
    searchKeys: {},
  }),
  computed: {
    pages() {
      if (!this.pagination) return 1;
      return Math.ceil(this.totalItems / this.pagination.itemsPerPage);
    },
    headersLength() {
      let headersLength = this.headers.length;
      if (this.$slots['actions-header']) headersLength += 1;
      return headersLength;
    },
    sortString() {
      const sortBy = this.pagination.sortBy[0];
      if (!sortBy) return null;
      return this.pagination.sortDesc[0] ? `-${sortBy}` : sortBy;
    },
    isVisibleExpandHeader() {
      return this.visibleHeaders.some(
        (header) => header.value === 'data-table-expand',
      );
    },
    generalLoading() {
      return this.$attrs.loading || this.loading;
    },
  },
  watch: {
    visibleHeaders(val) {
      window.localStorage.setItem(this.localStorageToken, JSON.stringify(val));
    },
    headers() {
      this.init();
    },
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.loadCachedSettings();
      this.loadItems();
    },
    // Load SmartTable headers settings from local storage
    loadCachedSettings() {
      const headers = JSON.stringify(this.headers);
      const method = String(this.method);

      const localStorageToken = `smarttable_${sum(headers + method)}`;
      const cachedSettings = window.localStorage.getItem(localStorageToken);
      if (!cachedSettings) {
        this.visibleHeaders = this.headers;
      } else {
        this.visibleHeaders = JSON.parse(cachedSettings);
      }
      this.localStorageToken = localStorageToken;
    },
    clearSearchKeys() {
      this.pagination = null;
      this.loadItems();
    },
    getPaginationKeys() {
      const paginationKeys = {};
      if (this.pagination) {
        paginationKeys.page = this.pagination.page;
        paginationKeys['per-page'] = this.pagination.itemsPerPage;
      }
      return paginationKeys;
    },
    async loadItems() {
      this.loading = true;
      const resp = await this.method({
        params: {
          sort: this.sortString,
          ...this.searchKeys,
          ...this.getPaginationKeys(),
        },
      });

      this.data = await this.getData(resp);
      this.items = this.getItems(this.data);

      this.totalItems = this.getTotalItems(this.data) || this.items.length;
      this.pagination.itemsPerPage =
        this.getPerPage(this.data) || DEFAULT_PER_PAGE;

      // Can access items via parent
      this.$emit('updated', this.items);

      this.loading = false;
    },
    getRowNumber(index) {
      return (
        this.pagination.itemsPerPage * (this.pagination.page - 1) + index + 1
      );
    },
    refresh() {
      this.loadItems();
    },
  },
};
</script>

<style lang="scss" scoped>
.v-api-datatable {
  ::v-deep table {
    tr {
      td:first-child,
      th:first-child {
        transition: all 0.1s ease-in-out;
        transition-property: box-shadow, background;
      }
    }
  }
  .pinned-first {
    ::v-deep table {
      tr {
        td:first-child,
        th:first-child {
          left: 0;
          z-index: 1;
          position: sticky;
          top: auto;
          background: #f5f5f5;
          box-shadow: inset -4px 0px 0 rgba(0, 0, 0, 0.7);
          transition: none;
        }
      }
    }
  }
}
</style>
