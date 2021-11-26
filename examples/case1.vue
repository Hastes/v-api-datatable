<template lang="pug">
  section
    h1 VApiDatatable component
    v-api-datatable(
      :method="$api.teachers.list"
      :headers="headers"
    )
      template(
        v-slot:item.price_per_hour="{ item }"
      )
        span {{ item.price_per_hour | currencyFilter }}

    h2 VCrudDatatable editable component
    smart-crud-table(
      :headers="headers"
      :method-create="$api.teachers.create"
      :method-list="$api.teachers.list"
      :method-view="$api.teachers.get"
      :method-update="$api.teachers.update"
      :method-delete="$api.teachers.delete"
    )
      template(
        v-slot:item.level_id="{ item }"
      )
        span {{ item.level_id | levelOutput(serverData) }}
</template>

<script>
// Case 1. Use plugin
// main.js
import Vue from 'vue';
import VApiDatatable from 'v-api-datatable';

Vue.use(VApiDatatable, {
  getData: async (resp) => {
    return await resp.json();
  },
  getTotalItems: (resp, data) => {
    return data.total;
  },
  getPerPage: (resp, data) => {
    return data.per_page;
  },
});

// headers for example for VCrudDatatable
const HEADERS = [
  {
    text: 'Login',
    value: 'name',
    component: VTextField,
  },
  {
    text: 'Password',
    value: 'password',
    hiddenForTable: true,
    component: VTextField,
    props: { type: 'password' },
  },
  {
    text: 'Last name',
    value: 'surname',
    component: VTextField,
  },
  {
    text: 'First name',
    value: 'first_name',
    component: VTextField,
  },
  {
    text: 'Patronymic',
    value: 'patronymic',
    component: VTextField,
  },
  {
    text: 'Position',
    value: 'position',
    component: VTextField,
  },
  {
    text: 'Education',
    value: 'level_id',
    component: EducationSelect,
  },
  {
    text: 'Teacher price',
    value: 'price_per_hour',
    component: EducationSelect,
  },
];
</script>
