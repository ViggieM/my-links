<script lang="ts">
	import { addTag, getChildrenIds, tags } from '$lib/stores/tags.svelte';
	import Tag from '$lib/components/tag.svelte';
	import { getAccessibleColor } from '$lib';
	import { fly, fade } from 'svelte/transition';

	const { visibleTags, selectedTagIds, tagId, blobId, supabase, r, g, b, a } = $props();

	const tag = tags.get(tagId);
	const children = getChildrenIds(tagId);

	async function onclick() {
		if (tag) addTag(selectedTagIds, tag.id);
		await supabase.from('blob_tags').delete().eq('blob_id', blobId);

		await supabase
			.from('blob_tags')
			.insert([...selectedTagIds].map((tagId) => ({ blob_id: blobId, tag_id: tagId })));
	}
</script>

{#if tag && (visibleTags.has(tagId) || tag.parent_id === null)}
	<div class="flex flex-wrap" in:fly={{ x: -100, duration: 300 }} out:fade>
		<button
			{onclick}
			class="border-md mr-2 rounded px-2 py-1 shadow outline-2 outline-offset-2 outline-current"
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
