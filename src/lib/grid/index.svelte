<script lang="ts">
	import { page } from "$app/stores";
	import { globalActions } from "$lib/store.js";
	import Items from "./items.svelte";

	export let data: any;
	export let PUBLIC_BOSAPI_BASE_URL: string;
	export let PUBLIC_BOSAPI_CLIENT_KEY: string;
</script>

{#if data && data.grid && data.grid.length > 0}
	{#if data.options?.hide_header !== true}
		<div class="cl1">
			<div>
				<div class="txt-xl">{$page.data?.title}</div>
				{#if $page.data?.description}
					<div class="txt-desc">
						{$page.data?.description}
					</div>
				{/if}
			</div>
			{#if $globalActions && $globalActions.component}
				<svelte:component
					this={$globalActions.component}
					listener={$globalActions.listener}
				/>
			{/if}
		</div>
	{/if}

	{#if data.options?.multigrid === false}
		<div class="single-grid">
			<Items {data} {PUBLIC_BOSAPI_BASE_URL} {PUBLIC_BOSAPI_CLIENT_KEY} />
		</div>
	{:else}
		<div class="gp1 {data.options?.gap !== false ? 'g4' : ''}">
			<Items {data} {PUBLIC_BOSAPI_BASE_URL} {PUBLIC_BOSAPI_CLIENT_KEY} />
		</div>
	{/if}
{:else}
	<p>No grid found. Please contact your Administrator.</p>
{/if}

<style>
	.cl1 {
		display: flex;
		margin-bottom: 0.75rem;
		justify-content: space-between;
		align-items: center;
	}
	.txt-xl {
		font-size: 1.25rem;
		line-height: 1.75rem;
	}
	.txt-desc {
		font-size: 0.875rem;
		line-height: 1.25rem;
	}
	.single-grid {
		display: flex;
		justify-content: center;
		align-items: center;
		height: calc(100vh - 67px);
	}
	.gp1 {
		display: grid;
		grid-template-columns: repeat(1, minmax(0, 1fr));
	}
	.g4 {
		gap: 1rem;
	}

	@media (min-width: 640px) {
		.gp1 {
			grid-template-columns: repeat(6, minmax(0, 1fr));
		}
	}

	@media (min-width: 1024px) {
		.gp1 {
			grid-template-columns: repeat(12, minmax(0, 1fr));
		}
	}
</style>
