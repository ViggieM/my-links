<script lang="ts">
	import SelectedTagsList from '$lib/components/selectedTagsList.svelte';
	import BlobUrl from '$lib/components/blobUrl.svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import { setBlobTags } from '$lib/services/datastore';

	let { data } = $props();

	// https://svelte.dev/docs/kit/state-management#Using-stores-with-context
	// das könnte ich machen, um nicht supabase überall einzutragen
	const { supabase, blob, blobTags } = data;
	const selectedTagIds: SvelteSet<number> = new SvelteSet(blobTags);
	let isMounted = false;

	$effect(() => {
		const tagIds = [...selectedTagIds];
		if (isMounted) {
			setBlobTags(supabase, blob.id, tagIds);
		} else {
			isMounted = true;
		}
	});
</script>

<article>
	<h1 class="mb-4 text-4xl">{blob.title}</h1>
	<div class="flex flex-col gap-2">
		<SelectedTagsList {blob} {selectedTagIds} {supabase}></SelectedTagsList>
		<BlobUrl {blob} />
	</div>
</article>
