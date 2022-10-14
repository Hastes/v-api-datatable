import {
  PreSaveFunction,
  GetDataFunction,
  GetItemsFunction,
  GetTotalItemsFunction,
  GetPerPageFunction,
  GetPaginationInstanceFunction,
} from './types';

export const DEFAULT_PER_PAGE = 15;

export const getPaginationInstance: GetPaginationInstanceFunction = () => ({
  page: 1,
  sortBy: [],
  itemsPerPage: DEFAULT_PER_PAGE,
});

const getData: GetDataFunction = (resp) => resp;
const getItems: GetItemsFunction = (resp) => resp.data.data;
const getTotalItems: GetTotalItemsFunction = (data) =>
  Number(data.headers['x-pagination-total-count']);
const getPerPage: GetPerPageFunction = (data) =>
  Number(data.headers['x-pagination-per-page']);

const preSave: PreSaveFunction = (method, args) => {
  return method(args);
};

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
  preSave: { type: Function, default: preSave },
};

export const RESERVED_HEADER_VALUES = ['data-table-expand'];
