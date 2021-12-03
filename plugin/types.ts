import { ValidationObserver } from 'vee-validate';

export type GetDataFunction = (response: any) => object;
export type GetItemsFunction = (response: any, data: any) => object[];
export type GetTotalItemsFunction = (response: any, data: any) => number;
export type GetPerPageFunction = (response: any, data: any) => number;

export interface DatatableHeaders {
  text: string;
  value: string;
}

export type PreSaveAttrs = {
  args: (string | number)[];
  data: object;
  obs: typeof ValidationObserver;
};
export type ApiMethodFunction = (attrs: PreSaveAttrs) => Promise<void | object>;

export type PreSaveFunction = (
  method: ApiMethodFunction,
  attrs: PreSaveAttrs,
) => Promise<void | object>;

export interface DatatablePluginOptions {
  getData?: GetDataFunction;
  getItems?: GetItemsFunction;
  getTotalItems?: GetTotalItemsFunction;
  getPerPage?: GetPerPageFunction;

  preSave?: PreSaveFunction;
}
