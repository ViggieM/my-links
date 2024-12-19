<script lang="ts">
	import SelectedTagsList from '$lib/components/selectedTagsList.svelte';
	import TagList from '$lib/components/tagList.svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import { enhance } from '$app/forms';

	let { data, form } = $props();
	import type Tag from '$lib/types/tags.d.ts';

	// https://svelte.dev/docs/kit/state-management#Using-stores-with-context
	// das könnte ich machen, um nicht supabase überall einzutragen
	const { supabase, blob, blobTags } = data;

	const selectedTags = new SvelteSet(blobTags);
	let searchInput = $state('');
	let searchResults: Tag[] = $state([]);

	async function onkeyup() {
		if (!searchInput) {
			searchResults = [];
			return;
		}
		const { data, error } = await supabase.rpc('search_tags_by_prefix', { prefix: searchInput });
		if (error) {
			console.log(error);
			searchResults = [];
		}

		console.log('data:', data);
		searchResults = data;
	}

	function truncate(source: string, size: number) {
		return source.length > size ? source.slice(0, size - 1) + '…' : source;
	}
</script>

<article>
	<h1 class="mb-4 text-4xl">{blob.title}</h1>
	<div class="flex flex-col gap-2">
		<div class="flex items-center gap-2">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="h-6 w-6"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z"
				/>
				<path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6Z" />
			</svg>

			{#if selectedTags.size > 0}
				<SelectedTagsList {selectedTags}></SelectedTagsList>
			{:else}
				no tags selected
			{/if}
		</div>
		<a
			href={blob.url}
			class="link link-primary flex items-center gap-2 overflow-hidden"
			title={blob.url}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="h-6 w-6"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
				/>
			</svg>

			{truncate(blob.url, 100)}
		</a>
		<div class="mt-4 flex items-center gap-2">
			<form class="w-full max-w-[500px]" action="?/selectTag" method="post" use:enhance>
				<input type="hidden" name="blobId" value={blob.id} />
				<label class="input input-sm input-bordered flex items-center gap-2">
					<input
						type="text"
						bind:value={searchInput}
						{onkeyup}
						placeholder="Search for a tag"
						class=" w-full"
					/>
				</label>
				{#if searchInput}
					<ul class="mt-2.5 rounded border shadow">
						<li class="flex h-10 items-center px-2">
							<button
								class="flex items-center gap-2"
								formaction="?/addTag"
								value={searchInput}
								name="newTagName"
								type={searchResults.length > 0 ? 'button' : 'submit'}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									class="h-6 w-6"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
									/>
								</svg>
								Add new tag "{searchInput}"
							</button>
						</li>
						{#each searchResults as tag}
							<li
								class="flex h-10 items-center gap-2 border-t-2 px-2"
								class:text-success={selectedTags.has(tag.id)}
							>
								<button value={tag.id} name="tagId">{tag.name}</button>
								{#if selectedTags.has(tag.id)}
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 20 20"
										fill="currentColor"
										class="size-5"
									>
										<path
											fill-rule="evenodd"
											d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
											clip-rule="evenodd"
										/>
									</svg>
								{/if}
							</li>
						{/each}
					</ul>
				{/if}
				{#if form?.error}
					<p class="my-2 text-error">{form.error}</p>
				{/if}
			</form>
		</div>
	</div>
</article>

<div class="mt-2">
	<TagList {selectedTags}></TagList>
</div>
