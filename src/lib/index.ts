import { executeFrontend } from '@bosapi/boslib';
import type { PageStore } from "./types/PageStore.js";
import type { TModal } from "./types/Component.js";
// @ts-ignore
export { default as Bosgrid } from './grid/index.svelte';
export type { PageStore, TModal };
export * from './store.js';
export const execute = async (action: any, inputs: any, options: any) => {
  // console.log(inputs)
  const res = await executeFrontend(action, {
    ...inputs,
    BOSAPI_BASE_URL: options.PUBLIC_BOSAPI_BASE_URL,
    BOSAPI_CLIENT_KEY: options.PUBLIC_BOSAPI_CLIENT_KEY
  });
  // console.log(res);
  return res;
};
