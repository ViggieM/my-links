<script lang="ts">
	import { tags } from '$lib/stores/tags.svelte';

	const { blobId, selectedTagIds, supabase } = $props();

	async function removeTagFromBlob(tagId: number) {
		const { error } = await supabase
			.from('blob_tags')
			.delete()
			.match({ blob_id: blobId, tag_id: tagId });
		// todo: add error message
		if (error) {
			console.error(error);
		}
		selectedTagIds.delete(tagId);
	}
</script>

<div class="flex items-center gap-2">
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		stroke-width="1.5"
		stroke="currentColor"
		class="h-6 w-6"
	>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z"
		/>
		<path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6Z" />
	</svg>

	{#if selectedTagIds.size > 0}
		<ul class="flex flex-wrap gap-2">
			{#each [...selectedTagIds].map((id) => tags.get(id)) as tag}
				{#if tag}
					<li class="badge">
						{tag.name}
						<button onclick={() => removeTagFromBlob(tag.id)} aria-label="unselect tag">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="size-4"
							>
								<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
							</svg>
						</button>
					</li>
				{/if}
			{/each}
		</ul>
	{:else}
		no tags selected
	{/if}
</div>
