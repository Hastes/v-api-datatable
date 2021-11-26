<template lang="pug">
  v-app
    v-main
      v-container
        h1 v-api-datatable
        v-api-datatable(
          :method="loadItems"
          :headers="headers"
        )
        h1 v-crud-datatable
        v-crud-datatable(
          :method-list="loadItems"
          :headers="headers"
        )
</template>

<script>
export default {
  data() {
    return {
      headers: [
        {
          text: 'Last name',
          value: 'last_name',
          component: 'v-text-field',
          rules: 'required',
        },
        { text: 'First name', value: 'first_name', component: 'v-text-field' },
        { text: 'Email', value: 'email', component: 'v-text-field' },
      ],
    };
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
