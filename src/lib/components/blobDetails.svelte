<script lang="ts">
	import TagsSelectedList from '$lib/components/tagsSelectedList.svelte';
	import TagBadge from '$lib/components/tagBadge.svelte';
	import { tags } from '$lib/stores/tags.svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import { setBlobTags } from '$lib/services/datastore';
	import snarkdown from 'snarkdown';

	let { props, supabase, editing = $bindable() } = $props();

	const selectedTagIds: SvelteSet<number> = $derived.by(() => {
		return new SvelteSet(props.bookmark.tags.map((el) => el.id));
	});

	let title = $state(props.bookmark.title);
	let url = $state(props.bookmark.url);
	let notes = $state(props.bookmark.notes);

	function edit() {
		editing = !editing;
		title = props.bookmark.title;
		url = props.bookmark.url;
		notes = props.bookmark.notes;
	}

	async function save() {
		await supabase.from('blobs').update({ title, url, notes }).eq('uuid', props.bookmark.uuid);

		const tagIds = [...selectedTagIds];
		await setBlobTags(supabase, props.bookmark.id, tagIds);

		editing = false;
		props.bookmark.title = title;
		props.bookmark.notes = notes;
		props.bookmark.url = url;
	}
</script>

{#if editing}
	<input
		type="text"
		class="mb-4 border-0 bg-inherit text-3xl font-bold outline-base-300"
		bind:value={title}
	/>
	<div class="mb-2 translate-y-[-5px] p-0.5">
		<TagsSelectedList {selectedTagIds} {supabase}></TagsSelectedList>
	</div>
	<div class="mb-5">
		<input type="url" class="w-full bg-inherit outline-base-300" bind:value={url} />
	</div>
	<div class="grid font-mono" style="grid-template-areas: 'stack'">
		<textarea
			style="grid-area: stack"
			rows="5"
			class="w-full overflow-y-scroll border-2 border-base-300 bg-inherit p-1 font-mono text-sm outline-base-300"
			placeholder="Notes..."
			bind:value={notes}
		></textarea>
		<pre class="invisible" style="grid-area: stack">{notes}</pre>
	</div>
{:else}
	<article>
		<h2 class="mb-4 text-3xl font-bold">{props.bookmark.title}</h2>
		<div class="mb-5 flex gap-1.5">
			{#each selectedTagIds as tagId (tagId)}
				{@const tag = tags.get(tagId)}
				<TagBadge {tag} />
			{/each}
		</div>
		<div class="mb-5">
			<span>{props.bookmark.url}</span>
		</div>
		<div>
			<article class="prose">
				{@html snarkdown(props.bookmark.notes)}
			</article>
		</div>
	</article>
{/if}

<div class="mt-8">
	{#if editing}
		<button onclick={edit} class="btn btn-secondary">Discard</button>
		<button class="btn btn-success" onclick={save}>Save</button>
	{:else}
		<button onclick={edit} class="btn btn-secondary">Edit</button>
	{/if}
</div>
