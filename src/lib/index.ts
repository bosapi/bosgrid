import { executeFrontend } from '@bosapi/boslib';

// Reexport your entry components here
export { default as Bosgrid } from './grid/index.svelte';

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
