<script lang="ts">
	import SelectedTagsList from '$lib/components/selectedTagsList.svelte';
	import TagList from '$lib/components/tagList.svelte';
	import { SvelteSet } from 'svelte/reactivity';

	let { data } = $props();

	// https://svelte.dev/docs/kit/state-management#Using-stores-with-context
	// das könnte ich machen, um nicht supabase überall einzutragen
	const { blob, blobTags } = data;

	const selectedTags = new SvelteSet(blobTags);
</script>

<article class="prose">
	<h1>{blob.title}</h1>
</article>

<SelectedTagsList {selectedTags}></SelectedTagsList>

<TagList {selectedTags}></TagList>
