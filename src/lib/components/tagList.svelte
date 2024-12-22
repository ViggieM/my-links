<script lang="ts">
	import { tags, getVisibleTagIds } from '$lib/stores/tags.svelte';
	import { createUniqueColorGenerator } from '$lib';
	import Tag from '$lib/components/tag.svelte';

	const { selectedTagIds, supabase, blobId } = $props();

	const visibleTags = $derived(getVisibleTagIds(selectedTagIds));

	const getUniqueColor = createUniqueColorGenerator();
</script>

<div class="flex flex-wrap gap-y-2">
	{#each [...tags.values()].filter((i) => i.parent_id === null) as tag}
		{@const [r, g, b, a] = [...getUniqueColor(), 1]}
		<Tag tagId={tag.id} {selectedTagIds} {supabase} {blobId} {visibleTags} {r} {g} {b} {a} />
	{/each}
</div>
