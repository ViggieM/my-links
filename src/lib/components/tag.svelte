<script lang="ts">
	import { addTag, getChildrenIds, tags } from '$lib/stores/tags.svelte';
	import Tag from '$lib/components/tag.svelte';
	import { getAccessibleColor } from '$lib';
	import { fly, fade } from 'svelte/transition';

	const { visibleTags, selectedTags, tagId, r, g, b, a } = $props();

	const tag = tags.get(tagId);
	const children = getChildrenIds(tagId);

	function onclick() {
		if (tag) addTag(selectedTags, tag.id);
	}
</script>

{#if tag && visibleTags.has(tagId)}
	<div class="flex" in:fly={{ x: -200, duration: 300 }} out:fade>
		<button
			{onclick}
			class="border-md mr-2 rounded px-2 py-1 shadow"
			style="color: {getAccessibleColor(r, g, b)}; background: linear-gradient(135deg, rgba({r +
				10},{g - 10},{b - 10},{a}) 0%, rgba({r - 5},{g + 5},{b + 5},{a}) 100%)"
		>
			{tag.name}
		</button>
		{#if children.length > 0}
			{#each children as childTagId}
				<Tag
					{visibleTags}
					{selectedTags}
					tagId={childTagId}
					r={r - 5}
					g={g + 5}
					b={b + 5}
					a={a - 0.1}
				/>
			{/each}
		{/if}
	</div>
{/if}
