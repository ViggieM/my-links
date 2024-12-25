<script lang="ts">
	import { tags } from '$lib/stores/tags.svelte';

	const { id } = $props();
	const tag = tags.get(id);
</script>

{#if tag}
	<span class="badge">{tag.name}</span>
{/if}
