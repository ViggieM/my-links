<script lang="ts">
	import TagsSelectedList from '$lib/components/tagsSelectedList.svelte';
	import ExternalLinkIcon from '$lib/icons/external-link.svelte';
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
	<h1 class="mb-2 text-2xl">
		<a href={blob.url} target="_blank" class="flex items-center gap-2">
			{blob.title}<ExternalLinkIcon class={'size-5'} />
		</a>
	</h1>
	<div class="flex flex-col gap-2">
		<TagsSelectedList {selectedTagIds} {supabase}></TagsSelectedList>
	</div>
</article>
