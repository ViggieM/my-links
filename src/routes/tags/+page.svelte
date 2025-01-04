<script lang="ts">
	import TagBadge from '$lib/components/tagBadge.svelte';
	import { orderTags, tags } from '$lib/stores/tags.svelte';

	const orderedTaggs = $derived(orderTags(tags));
</script>

<ul>
	{#each orderedTaggs as tag}
		<li class="group flex items-center gap-1" style={`margin-left: ${tag.level * 10}px`}>
			<TagBadge {tag} />
		</li>
	{/each}
</ul>
