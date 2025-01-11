<script lang="ts">
	import BlobListItem from '$lib/components/blobListItem.svelte';
	import SearchBar from '$lib/components/searchBar.svelte';
	import { page } from '$app/state';
	import { filterBlobs } from '$lib/services/datastore';

	let { data } = $props();
	let { supabase } = $derived(data);
	let isCtrlDown = $state(false);
	let isKDown = $state(false);

	let queryString = $state(page.url.searchParams.get('q') || '');
	let selectedTagIds = $derived(
		page.url.searchParams.getAll('tag').map(Number).filter(Number.isFinite)
	);

	function onkeydown(evt: KeyboardEvent) {
		if (evt.key === 'Control') isCtrlDown = true;
		if (evt.code === 'KeyK') isKDown = true;
		if (isCtrlDown && isKDown) {
			evt.preventDefault();
			document.getElementById('search')?.focus();
		}
	}

	function onkeyup(evt: KeyboardEvent) {
		if (evt.key === 'Control') isCtrlDown = false;
		if (evt.code === 'KeyK') isKDown = false;
	}
</script>

<div>
	<SearchBar bind:value={queryString} {selectedTagIds} />
</div>
{#await filterBlobs(supabase, queryString, selectedTagIds)}
	<div class="flex items-center justify-center">
		<span class="loading loading-spinner loading-lg"></span>
	</div>
{:then bookmarks}
	<div class="p-2">
		{#if bookmarks.length > 0}
			{#each bookmarks as bookmark}
				<div class="my-2 rounded-md border px-4 py-2">
					<BlobListItem {bookmark} />
				</div>
			{/each}
		{:else}
			<p>no results</p>
		{/if}
	</div>
{/await}

<svelte:window {onkeydown} {onkeyup} />
