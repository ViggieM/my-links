<script lang="ts">
	import TagBadge from '$lib/components/tagBadge.svelte';
	const { bookmark } = $props();
</script>

<label for="sidebar" class="drawer-button cursor-pointer gap-2">
	{#if bookmark.url}
		<span class="block">
			<a
				href={bookmark.url}
				target="_blank"
				aria-label="external link"
				class="text-sm text-gray-600"
			>
				{bookmark.title}
			</a>
		</span>
	{/if}
	<span class="mt-2 block flex flex-wrap gap-1">
		{#each bookmark.tags as tag (tag.id)}
			<TagBadge {tag} />
		{/each}
	</span>
</label>
