<script lang="ts">
	import TagBadge from '$lib/components/tagBadge.svelte';
	const { bookmark } = $props();
</script>

<div>
	<div class="flex items-center gap-2">
		<a href="/blob/{bookmark.uuid}">{bookmark.title}</a>
		{#if bookmark.url}
			<a href={bookmark.url} target="_blank" aria-label="external link" class="text-gray-600">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="size-4"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
					/>
				</svg>
			</a>
		{/if}
		<label for="sidebar" class="drawer-button ml-auto cursor-pointer" title="Notes">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="size-5"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
				/>
			</svg>
		</label>
	</div>
	<div class="mt-2 flex gap-1">
		{#each bookmark.tags as tag (tag.id)}
			<TagBadge {tag} />
		{/each}
	</div>
</div>
