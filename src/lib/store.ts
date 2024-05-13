import { writable, type Writable } from 'svelte/store';
import type { TModal } from './types/Component.js';

export const modal: Writable<TModal> = writable();
export const globalActions: Writable<any> = writable(undefined);
