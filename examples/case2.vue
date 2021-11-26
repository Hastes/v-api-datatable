<template lang="pug">
  v-api-datatable(
    :method="loadItems"
    :headers="headers"
  )
</template>

<script>
// Case 2. Just import
// my-component.vue
import { VApiDatatable } from 'v-api-datatable';

export default {
  components: {
    VApiDatatable,
  },
  data() {
    return {
      headers: [
        { text: 'Last name', value: 'last_name' },
        { text: 'First name', value: 'first_name' },
        { text: 'Email', value: 'email' },
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
