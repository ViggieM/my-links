<script lang="ts">
	import TagBadge from '$lib/components/tagBadge.svelte';
	import BlobListItem from '$lib/components/blobListItem.svelte';

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

<div class="overflow-x-auto">
	<form action="" method="post" class="flex items-center gap-2 p-2">
		<label class="input input-bordered flex grow items-center gap-2">
			<input type="text" class="grow" placeholder="Search" id="search" />
			<kbd class="kbd kbd-sm">⌘</kbd>
			<kbd class="kbd kbd-sm">K</kbd>
		</label>
		<a href="/blob/add" class="btn btn-sm">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="size-6"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
				/>
			</svg>
			Create
		</a>
	</form>
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
