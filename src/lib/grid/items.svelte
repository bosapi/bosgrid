<script lang="ts">
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import { execute } from "$lib/index.js";
	import { modal } from "$lib/store.js";
	import type { PageStore } from "$lib/types/PageStore.js";
	import { getContext, onDestroy } from "svelte";
	import { get, writable, type Writable } from "svelte/store";

	export let data: any;
	export let PUBLIC_BOSAPI_BASE_URL: string;
	export let PUBLIC_BOSAPI_CLIENT_KEY: string;

	const pageStore: Writable<PageStore> = getContext("pageStore");
	const actions: any = getContext("actions") || {};
	const mappingAction: any = data.mapping_action || {};
	const componentConfig: any = {};
	const componentData: any = {};

	function getUrlQuery() {
		const query: any = {};
		if ($page && $page.url.searchParams.size > 0) {
			for (const key of $page.url.searchParams.keys()) {
				query[key] = $page.url.searchParams.get(key);
			}
		}
		return query;
	}

	const unsubscribe = pageStore.subscribe(async (val) => {
		// handle circular
		if (val.from === "backend") return;
		let result: any;
		if (val.to === "page") {
			if (val.action === "goto") {
				goto(val.detail);
				return reset(val, result);
			}
			// console.log(val);
			let key = `./actions/${val.action}.json`;
			if (mappingAction[val.action]) {
				key = `./actions/${mappingAction[val.action]}.json`;
			}
			// console.log(key, val);
			if (actions[key]) {
				const action = await actions[key]();
				try {
					// execute action here
					result = await execute(
						action,
						{
							detail: val.detail,
							pageStore,
							query: getUrlQuery(),
							componentConfig: getComponentConfig(),
							componentData: getComponentData(),
						},
						{ PUBLIC_BOSAPI_BASE_URL, PUBLIC_BOSAPI_CLIENT_KEY },
					);
					// console.log(result);
				} catch (error: any) {
					modal.set({ body: error.message });
				}
			}
		}
		reset(val, result);
	});

	function reset(val: any, result: any) {
		pageStore.set({
			from: "backend",
			to: val.from,
			action: "done",
			detail: result,
		});
	}

	// TODO: remove this function if we upgraded to svelte 5
	function getComponentConfig() {
		let config: any = {};
		for (const key in componentConfig) {
			config[key] = get(componentConfig[key]);
		}
		return config;
	}

	// TODO: remove this function if we upgraded to svelte 5
	function getComponentData() {
		let _data: any = {};
		for (const key in componentData) {
			_data[key] = get(componentData[key]);
		}
		return _data;
	}

	function setComponentConfig(name: string, config: any) {
		componentConfig[name] = config;
		return config;
	}

	function setComponentData(name: string, data: any) {
		componentData[name] = data;
		return data;
	}

	onDestroy(unsubscribe);
</script>

{#each data.grid as item}
	{@const componentItem = item.component}
	<div class={item.class}>
		{#if data.components[componentItem]}
			{@const configStore = setComponentConfig(
				item.name,
				writable(item.config),
			)}
			{@const dataStore = setComponentData(
				item.name,
				writable(data[item.data]),
			)}
			<svelte:component
				this={data.components[componentItem]}
				name={item.name}
				config={configStore}
				data={dataStore}
			/>
		{/if}
	</div>
{/each}
