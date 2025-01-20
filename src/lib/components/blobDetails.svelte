<script lang="ts">
	import TagsSelectedList from '$lib/components/tagsSelectedList.svelte';
	import TagBadge from '$lib/components/tagBadge.svelte';
	import { tags } from '$lib/stores/tags.svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import { setBlobTags } from '$lib/services/datastore';
	import snarkdown from 'snarkdown';
	import { page } from '$app/state';

	let { bookmark } = $props();

	const supabase = page.data.supabase;

	const selectedTagIds: SvelteSet<number> = $derived.by(() => {
		return new SvelteSet(bookmark.tags.map((el) => el.id));
	});
	let editing = $state(false);

	let title = $state('');
	let url = $state('');
	let notes = $state('');

	function edit() {
		editing = !editing;
		title = bookmark.title;
		url = bookmark.url;
		notes = bookmark.notes;
	}

	async function save() {
		await supabase.from('blobs').update({ title, url, notes }).eq('uuid', bookmark.uuid);

		const tagIds = [...selectedTagIds];
		await setBlobTags(supabase, bookmark.id, tagIds);

		editing = false;
		bookmark.title = title;
		bookmark.notes = notes;
		bookmark.url = url;
	}
</script>

{#if editing}
	<div>
		<input
			type="text"
			class="mb-4 w-full border-0 bg-inherit text-3xl font-bold outline-base-300"
			bind:value={title}
		/>
		<div class="mb-2 translate-y-[-5px] p-0.5">
			<TagsSelectedList {selectedTagIds} {supabase}></TagsSelectedList>
		</div>
		<div class="mb-5">
			<input type="url" class="w-full bg-inherit outline-base-300" bind:value={url} />
		</div>
		<div>
			<textarea
				class="field-sizing-content min-h-28 w-full overflow-y-scroll border-2 border-base-300 bg-inherit p-1 font-mono text-sm outline-base-300"
				placeholder="Notes..."
				bind:value={notes}
			></textarea>
		</div>
	</div>
{:else}
	<article>
		<h2 class="mb-4 text-3xl font-bold">{bookmark.title}</h2>
		<div class="mb-5 flex gap-1.5">
			{#each selectedTagIds as tagId (tagId)}
				{@const tag = tags.get(tagId)}
				<TagBadge {tag} />
			{/each}
		</div>
		<div class="mb-5">
			<a class="link block overflow-hidden truncate text-ellipsis w-full" target="_blank" href="{bookmark.url}" title="{bookmark.url}">{bookmark.url}</a>
		</div>
		<div>
			<article class="prose">
				{@html snarkdown(bookmark.notes)}
			</article>
		</div>
	</article>
{/if}

<div class="mt-10 flex gap-2">
	{#if editing}
		<button onclick={edit} class="btn btn-warning flex-1">Discard changes</button>
		<button class="btn btn-success flex-1" onclick={save}>Save</button>
	{:else}
		<button onclick={edit} class="btn btn-info grow">Edit</button>
	{/if}
</div>
