<script lang="ts">
	import { tags, getParentIds } from '$lib/stores/tags.svelte';
	import { createUniqueColorGenerator } from '$lib';
	import Tag from '$lib/components/tag.svelte';

	const { selectedTags } = $props();

	const visibleTags = $derived.by(() => {
		const result = [];
		for (let id of selectedTags) {
			result.push(id);

			// parents are visible
			const parents = getParentIds(id);
			result.push(...parents);

			// all siblings and siblings of the parents are visible
			const siblings = [...tags.values()].filter((i) => parents.includes(i.parent_id));
			result.push(...siblings.map((el) => el.id));

			// first level children are visible
			const children = [...tags.values()].filter((i) => i.parent_id === id);
			result.push(...children.map((el) => el.id));
		}

		return new Set(result);
	});

	const topLevelTags = $derived.by(() => {
		const _tags = [...tags.values()].filter((i) => i.parent_id === null);
		return new Set(_tags.map((el) => el.id));
	});

	const getUniqueColor = createUniqueColorGenerator();
</script>

<div class="flex">
	{#each topLevelTags as tagId}
		{@const [r, g, b, a] = [...getUniqueColor(), 1]}
		<Tag {tagId} {selectedTags} {visibleTags} {r} {g} {b} {a} />
	{/each}
</div>
