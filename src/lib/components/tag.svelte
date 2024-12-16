<script lang="ts">
	import { addTag, getChildrenIds, tags } from '$lib/stores/tags.svelte';
	import Tag from '$lib/components/tag.svelte';

	const { visibleTags, selectedTags, tagId, r, g, b, a } = $props();

	const tag = tags.get(tagId);
	const children = getChildrenIds(tagId);

	function onclick() {
		if (tag) addTag(selectedTags, tag.id);
	}
</script>

{#if tag && visibleTags.has(tagId)}
	<button
		{onclick}
		class="border-md mr-2 rounded px-2 py-1 shadow"
		style="background-color: rgba({r}, {g}, {b}, {a});"
	>
		{tag.name}
	</button>
	{#if children.length > 0}
		{#each children as childTagId}
			<Tag
				{visibleTags}
				{selectedTags}
				tagId={childTagId}
				r={r - 20}
				g={g + 10}
				b={b - 10}
				a={a - 0.2}
			/>
		{/each}
	{/if}
{/if}
