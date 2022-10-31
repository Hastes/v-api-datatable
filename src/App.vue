<template lang="pug">
  v-app
    v-main
      v-container
        v-row
          v-col(cols=12)
            h1 v-api-datatable
            v-api-datatable(
              :method="loadItems"
              :headers="headers1"
              :expanded.sync="expanded1"
              single-expand
              show-expand
            )
              template(v-slot:expanded-item="{ headers }")
                td(:colspan="headers.length")
                  span test-1

        v-row
          v-col(cols=12)
            h1 v-crud-datatable
            v-crud-datatable(
              v-model="selected"
              :method-list="loadItems"
              :method-create="loadItems"
              :method-update="loadItems"
              :method-delete="loadItems"
              :expanded.sync="expanded2"
              :headers="headers2"
              :append-headers="appendHeaders"
              :server-per-page="false"
              single-expand
              show-expand
              show-select
            )
              template(v-slot:expanded-item="{ headers }")
                td(:colspan="headers.length")
                  span test-2
</template>

<script>
import { VTextField } from 'vuetify/lib';

export default {
  data() {
    return {
      appendHeaders: [{ text: '', value: 'data-table-expand' }],
      expanded1: [],
      expanded2: [],
      selected: [],
      dialogFormData: {},
    };
  },
  computed: {
    headers1() {
      return [
        { text: 'Last name', value: 'last_name', component: VTextField },
        { text: 'First name', value: 'first_name', component: VTextField },
        { text: 'Email', value: 'email', component: VTextField },
        { text: '', value: 'data-table-expand' },
      ];
    },
    headers2() {
      return [
        { text: 'Last name', value: 'last_name', component: VTextField },
        { text: 'First name', value: 'first_name', component: VTextField },
        { text: 'Email', value: 'email', component: VTextField },
      ];
    },
  },
  methods: {
    loadItems({ params }) {
      return fetch(
        `https://reqres.in/api/users/?${new URLSearchParams(params)}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    },
  },
};
</script>
