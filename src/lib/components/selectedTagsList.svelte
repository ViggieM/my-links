<script lang="ts">
	import { tags } from '$lib/stores/tags.svelte';
	import type { Tag } from '$lib/types/tags.d';

	const { selectedTags } = $props();

	function getSelectedTags(): Tag[] {
		return [...selectedTags].map((id) => tags.get(id)).filter((value) => value !== undefined);
	}
</script>

<ul class="flex flex-wrap gap-2">
	{#each getSelectedTags() as tag}
		<li class="badge">{tag.name}</li>
	{/each}
</ul>
