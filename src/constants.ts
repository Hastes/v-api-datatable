import {
  PreSaveFunction,
  GetDataFunction,
  GetItemsFunction,
  GetTotalItemsFunction,
  GetPerPageFunction,
} from './components/types';

export const DEFAULT_PER_PAGE = 15;

const getData: GetDataFunction = (resp) => resp.data;
const getItems: GetItemsFunction = (resp, data) => data.data;
const getTotalItems: GetTotalItemsFunction = ({ headers }) =>
  Number(headers['x-pagination-total-count']);
const getPerPage: GetPerPageFunction = ({ headers }) =>
  Number(headers['x-pagination-per-page']);

const preSave: PreSaveFunction = (method, args) => method(args);

/**
 * Configuration datatable
 *
 * props that can be rewrite when component registering as plugin.
 * always have default field.
 */
export const REGISTRATION_PROPS = {
  getData: { type: Function, default: getData },
  getItems: { type: Function, default: getItems },
  getTotalItems: { type: Function, default: getTotalItems },
  getPerPage: { type: Function, default: getPerPage },
};

export const REGISTRATION_CRUD_PROPS = {
  inputsAttrs: { type: Object, default: () => ({}) },
  preSave: { type: Function, default: preSave },
};
