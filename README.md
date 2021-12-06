# Vuetify plugin VApiDatatable

<p align="center">
  <a href="https://npmcharts.com/compare/v-api-datatable?minimal=true">
    <img src="http://img.shields.io/npm/dm/v-api-datatable.svg">
  </a>
  <a href="https://www.npmjs.org/package/v-api-datatable">
    <img src="https://img.shields.io/npm/v/v-api-datatable.svg">
  </a>
  <a href="http://img.badgesize.io/https://unpkg.com/v-api-datatable/lib/v-api-datatable.umd.js?compression=gzip&label=gzip">
    <img src="http://img.badgesize.io/https://unpkg.com/v-api-datatable/lib/v-api-datatable.umd.js?compression=gzip&label=gzip">
  </a>
  <a href="LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-yellow.svg">
  </a>
</p>

**Vuetify complex v-data-table based component for server requests** ✨

<p align="center">
<img width="600px" src="https://s10.gifyu.com/images/Screen-Recording-2021-12-06-at-12.58.11-1.gif"/>
</p>

### Package includes 2 components
### VApiDatatable
Use for easy server requests. Just pass your _api methods_ and _headers_ to component and use!
### VCrudDatatable
Use for CRUD server models

# Features

### VApiDatatable

* **Server change pagination, sort, perpage** - Just pass api methods
* **Settings module** - Reorder, pin and hide colums. And it will be cached to local storage. 
* **Add custom search field** - Pass your search fields via slots

### VCrudDatatable
* **Inludes all features VApiDatatable**
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

# Plugin options

| Name           | Type       | Args           | Required | Description                             |
| -------------- | ---------- | -------------- | -------- | --------------------------------------- |
| getData        | `function` | response       | --       | Unpacking data from response            |
| getTotalItems  | `function` | response       | --       | Unpacking total items from response     |
| getPerPage     | `function` | response       | --       | Unpacking per page items from response  |
| getItems       | `function` | response, data | --       | Get array items from response           |
| preSave        | `function` | method, args   | --       | Pre save wrapper for v-crud-datatable   |


# Props
### v-api-datatable 
  * method - request data from server. Return Promise
  * headers - [{ text, value }, {text, value }]
  * prettifyField - { type: Function, default: (item, key) => item[key] }:
       wrap data every item for prettify output. Attributes: item, key(value of current header)
  * external-pagination - pagination via v-pagination
  * get-data
  * get-total-items
  * get-per-page
  * get-items
  * pre-save

### v-crud-datatable
  * includes all v-api-datatable props
  * headers - Array<{
      text: string,
      value: string,
      hiddenForTable?: boolean,
      hiddenForForm?: boolean,
      component: [object, string],
      props?: [object]
    }>
  * method-list: { type: Function, required: true }
  * method-view: { type: Function, default: null }
  * method-create: { type: Function, default: null }
  * method-update: { type: Function, default: null }
  * method-delete: { type: Function, default: null }
  * serialize-data: { type: Function, default: (data: any) => data } - Before save data serialize
  * serialize-instance-data: { type: Function, default: (data: any) => data } - After instance load data serialize

# Slots
### v-api-datatable
  * search-fields: { searchKeys: any, runSearch: function }
  * expand-search-fields: { searchKeys: any }
  * search-actions: { searchKeys: any }
  * item.(name): { item: any, index: number }
  * header.(name): { header: any }
  * row: { item: any }
  * loading
  * no-data
  * no-results

### v-curd-datatable
  * includes all v-api-datatable props

# Emits
  ### v-api-datatable
  * update(items)
  ### v-crud-datatable
  * item:deleted
  * item:updated
  * item:created

## Roadmap
1. Add i18n

Welcome to contribute!

# License

MIT © Komarov Roman

