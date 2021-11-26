# Vuetify component v-api-datatable

[![Build Status](https://travis-ci.com/hastes/v-api-datatable.svg?branch=master)](https://travis-ci.com/hastes/v-api-datatable) [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

**Vuetify upgraded v-datatable for server requests** ✨

### Package includes 2 components
### VApiDatatable
Use for easy server requests. Just pass your _api methods_ and _headers_ to component and use!
### VCrudDatatable
Use for CRUD server models

# Features

### VApiDatable

* **Server change pagination, sort, perpage** - Just pass api methods
* **Settings module** - Reorder, pin and hide colums. And it will be cached to local storage. 
* **Add custom search field** - Pass your search fields via slots

### VCrudDatable
* **Inludes all features VApiDatable**
* **Create object** - Pass your create(POST) method to **method-create** prop
* **Delete object** - Pass your delete(DELETE) method to **method-delete** prop
* **Update object** - Pass your update(PUT) method to **method-update** prop

# Requirements
* Vuetify 2.x
* Vue 2.x

# Installation

### Install package
```shell
npm install --save v-api-datatable
```
or
```shell
yarn add v-api-datatable
```

### Local
`component.vue`
```vue
<script>
import { VApiDatatable } from 'v-api-datatable'

export default {
  components: { VApiDatatable },
}
</script>
```

### Global
`main.js`
```javascript
import Vue from 'vue'
import VApiDatatable from 'v-api-datatable'

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
})
```


Welcome to contribute!

# License

MIT © Komarov Roman

