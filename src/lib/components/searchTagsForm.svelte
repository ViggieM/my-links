<script lang="ts">
	import { enhance } from '$app/forms';
	const { supabase, blobId, form, selectedTagIds } = $props();

	let searchInput = $state('');
	let searchResults: Tag[] = $state([]);

	// todo: debounce
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

		searchResults = data;
	}
</script>

<form class="relative w-full max-w-[500px]" action="?/selectTag" method="post" use:enhance>
	<input type="hidden" name="blobId" value={blobId} />
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
		<ul class="absolute mt-2.5 min-w-[300px] rounded border bg-white shadow">
			{#each searchResults as tag}
				<li
					class="flex h-10 items-center gap-2 px-2"
					class:text-success={selectedTagIds.has(tag.id)}
				>
					<button value={tag.id} name="tagId">{tag.name}</button>
					{#if selectedTagIds.has(tag.id)}
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
			<li class="flex h-10 items-center px-2">
				<button
					class="flex items-center gap-2 text-sm"
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
						class="size-4"
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
		</ul>
	{/if}
	{#if form?.error}
		<p class="my-2 text-error">{form.error}</p>
	{/if}
</form>
