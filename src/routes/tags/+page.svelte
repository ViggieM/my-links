<script lang="ts">
	import TagBadge from '$lib/components/tagBadge.svelte';
	import { getOrderedTags } from '$lib/stores/tags.svelte';

	let { data } = $props();
	const { supabase } = data;
</script>

<ul>
	{#each getOrderedTags() as tag}
		<li><TagBadge id={tag.id} /></li>
	{/each}
</ul>
