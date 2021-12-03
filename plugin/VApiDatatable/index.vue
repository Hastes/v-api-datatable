<template lang="pug">
  .smart-table
    v-alert.mt-2(v-if="error" type="error" outlined) {{ error }}

    v-card
      v-card-text
        table-search(
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

        .smart-table__wrapper
          v-data-table(
            v-if="!error && visibleHeaders"
            loader-height="3"
            v-bind="$attrs"
            :class="{ 'pinned-first': pinnedHeader && !loading }"
            :loading="loading"
            :headers="visibleHeaders"
            :headersLength="headersLength"
            :items="items"
            :options.sync="pagination"
            :server-items-length="totalItems"
            :hide-default-footer="loading || externalPagination"
            @update:page="loadItems"
            @update:items-per-page="loadItems"
            @update:sort-desc="loadItems"
          )
            template(v-slot:item="props")
              tr
                slot(name="row" v-bind:item="props.item")

                  td(
                    v-for="(t, idx) in visibleHeaders"
                    :key="idx"
                  )
                    slot(
                      :name="`item.${t.value}`"
                      :item="props.item"
                      :index="getRowNumber(props.index)"
                    )
                      span {{ prettifyField(props.item, t.value, getRowNumber(props.index)) }}

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

            template(slot="loading")
              v-skeleton-loader(type="table-tbody")

            template(slot="no-data")
              .text-xs-center Отсутствуют данные

            template(slot="no-results")
              .text-xs-center Не найдено подходящих данных

          .pt-4(v-if="externalPagination && items.length")
            v-pagination(
              v-model="pagination.page"
              :disabled="loading"
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

    VIEW_LINK_VALUE: '-view-link',
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
      this.items = this.getItems(resp, this.data);

      this.totalItems =
        this.getTotalItems(resp, this.data) || this.items.length;
      this.pagination.itemsPerPage =
        this.getPerPage(resp, this.data) || DEFAULT_PER_PAGE;

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
.smart-table {
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
