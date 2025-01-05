<script lang="ts">
	import TagBadge from '$lib/components/tagBadge.svelte';
	import BlobListItem from '$lib/components/blobListItem.svelte';
  import SearchBar from '$lib/components/searchBar.svelte';
  import { enhance } from '$app/forms';

	let { data } = $props();
	let { blobs } = $derived(data);
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
  <form action="?/search" method="post" use:enhance>
    <SearchBar/>
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
			{#each blobs as blob}
				<tr>
					<td><BlobListItem {blob} /></td>
					<td>
						<div class="flex gap-1">
							{#each blob.blob_tags as tag}
								<TagBadge id={tag.tag_id} />
							{/each}
						</div>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<svelte:window {onkeydown} {onkeyup} />
