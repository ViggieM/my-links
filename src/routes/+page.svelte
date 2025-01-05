<script lang="ts">
	import TagBadge from '$lib/components/tagBadge.svelte';
	import BlobListItem from '$lib/components/blobListItem.svelte';
	import SearchBar from '$lib/components/searchBar.svelte';
	import { enhance } from '$app/forms';
	import { Bookmark } from '$lib/services/datastore';

	let { data } = $props();
	let { bookmarks } = data;
	const list = bookmarks?.map((el) => new Bookmark(el)) ?? [];
	let isCtrlDown = $state(false);
	let isKDown = $state(false);

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

<div class="p-2">
	<form
		action="?/search"
		method="post"
		use:enhance={() => {
			return async ({ result, update }) => {
				await update();
				if (result.type === 'success') {
					searchResults = result.data || [];
					console.log(result);
				}
			};
		}}
	>
		<SearchBar />
	</form>
</div>

<div class="overflow-x-auto">
	<table class="table">
		<thead>
			<tr>
				<th>Title</th>
				<th>Tags</th>
			</tr>
		</thead>
		<tbody>
			{#each list as bookmark}
				<tr>
					<td><BlobListItem {bookmark} /></td>
					<td>
						<div class="flex gap-1">
							{#each bookmark.tags as tag}
								<TagBadge {tag} />
							{/each}
						</div>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<svelte:window {onkeydown} {onkeyup} />
