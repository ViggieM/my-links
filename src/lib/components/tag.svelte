<script lang="ts">
	import { getAncestors, getChildrenIds, getDescendants, tags } from '$lib/stores/tags.svelte';
	import Tag from '$lib/components/tag.svelte';
	import { getAccessibleColor } from '$lib';
	import { fly, fade } from 'svelte/transition';

	const { visibleTags, selectedTagIds, tagId, blobId, supabase, r, g, b, a } = $props();

	const tag = tags.get(tagId);
	const children = getChildrenIds(tagId);

	async function onclick() {
		if (!tag) return;

		for (let i of getAncestors(tag)) {
			selectedTagIds.delete(i);
		}
		for (let i of getDescendants(tag)) {
			selectedTagIds.delete(i);
		}

		// select tag if it was previously not selected, else unselect it
		if (selectedTagIds.has(tag.id)) {
			selectedTagIds.delete(tag.id);
		} else {
			selectedTagIds.add(tag.id);
		}
	}
</script>

{#if tag && (visibleTags.has(tagId) || tag.parent_id === null)}
	<div class="flex flex-wrap" in:fly={{ x: -100, duration: 300 }} out:fade>
		<button
			{onclick}
			class="badge mr-2 shadow outline-1 outline-offset-1 outline-current"
			class:outline={selectedTagIds.has(tagId)}
			style="color: rgba({r},{g},{b}, 0.7); background: linear-gradient(135deg, rgba({r + 10},{g -
				10},{b - 10},{a}) 0%, rgba({r - 5},{g + 5},{b + 5},{a}) 100%)"
		>
			<span style="color: {getAccessibleColor(r, g, b)}">{tag.name}</span>
		</button>
		{#if children.length > 0}
			{#each children as childTagId}
				<Tag
					{visibleTags}
					{selectedTagIds}
					tagId={childTagId}
					{blobId}
					{supabase}
					r={r - 5}
					g={g + 5}
					b={b + 5}
					a={a - 0.1}
				/>
			{/each}
		{/if}
	</div>
{/if}
