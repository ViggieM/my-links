<script lang="ts">
	import { tags, blobTagsController, getChildrenIds } from '$lib/stores/tags.svelte.js';

	let { data } = $props();

	// https://svelte.dev/docs/kit/state-management#Using-stores-with-context
	// das könnte ich machen, um nicht supabase überall einzutragen
	const { blob, blobTags } = data;

	const tagsController = blobTagsController(blobTags || []);

	function createUniqueColorGenerator(): () => [number, number, number] {
		const usedColors = new Set<string>();

		function getRandomColor(): [number, number, number] {
			let r: number, g: number, b: number, colorKey: string;

			do {
				r = Math.floor(Math.random() * 256);
				g = Math.floor(Math.random() * 256);
				b = Math.floor(Math.random() * 256);
				colorKey = `${r},${g},${b}`; // Create a unique key for the RGB triplet
			} while (usedColors.has(colorKey));

			usedColors.add(colorKey);
			return [r, g, b];
		}

		return getRandomColor;
	}

	// Usage
	const getUniqueColor = createUniqueColorGenerator();
</script>

<h1>{blob.title}</h1>

<ul>
	{#each tagsController.getSelectedTags() as tag}
		<li>{tag.name}</li>
	{/each}
</ul>

{#snippet tagButton(tagId: number, [r, g, b, a]: number[])}
	{#if tagsController.visibleTags.has(tagId)}
		{@const tag = tags.get(tagId)}
		{#if tag}
			<li>
				<button
					class="border-md mr-2 rounded px-2 py-1"
					style="background-color: rgba({r}, {g}, {b}, {a});"
					onclick={() => {
						tagsController.addTag(tag.id);
					}}>{tag.name}</button
				>
			</li>
			{@const children = getChildrenIds(tagId)}
			{#if children.length > 0}
				<ul class="flex">
					{#each children as childTagId}
						{@render tagButton(childTagId, [r - 20, g + 10, b - 10, a - 0.2])}
					{/each}
				</ul>
			{/if}
		{/if}
	{/if}
{/snippet}

<ul class="flex">
	{#each tagsController.topLevelTags as tagId}
		{@render tagButton(tagId, [...getUniqueColor(), 0.8])}
	{/each}
</ul>
