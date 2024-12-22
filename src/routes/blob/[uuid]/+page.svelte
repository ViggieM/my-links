<script lang="ts">
	import SelectedTagsList from '$lib/components/selectedTagsList.svelte';
	import TagList from '$lib/components/tagList.svelte';
	import BlobUrl from '$lib/components/blobUrl.svelte';
	import SearchTagsForm from '$lib/components/searchTagsForm.svelte';
	import { SvelteSet } from 'svelte/reactivity';

	let { data, form } = $props();

	// https://svelte.dev/docs/kit/state-management#Using-stores-with-context
	// das könnte ich machen, um nicht supabase überall einzutragen
	const { supabase, blob, blobTags } = data;

	const selectedTagIds: SvelteSet<number> = new SvelteSet(blobTags);
</script>

<article>
	<h1 class="mb-4 text-4xl">{blob.title}</h1>
	<div class="flex flex-col gap-2">
		<SelectedTagsList blobId={blob.id} {selectedTagIds} {supabase}></SelectedTagsList>
		<BlobUrl {blob} />

		<div class="mt-4">
			<SearchTagsForm {selectedTagIds} {form} {supabase} blobId={blob.id} />
		</div>
	</div>
</article>

<div class="mt-4">
	<TagList blobId={blob.id} {supabase} {selectedTagIds}></TagList>
</div>
