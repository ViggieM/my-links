<script lang="ts">
	import TagBadge from '$lib/components/tagBadge.svelte';
	import { enhance } from '$app/forms';
	import { orderTags, tags } from '$lib/stores/tags.svelte';
	import PenSVG from '$lib/icons/pen.svg.svelte';

	let { data } = $props();
	const { supabase } = data;
	const orderedTags = $derived(orderTags(tags));
	let editingIndex = $state(-1);
	let color = $state(`#ffffff`);

	const focus = (node: HTMLInputElement) => {
		node.focus();
	};
</script>

<ul>
	{#each orderedTags as tag, index (tag.id)}
		{@const level = tag.level || 0}
		<li class="group flex items-center gap-1" style={`margin-left: ${level * 10}px`}>
			{#if editingIndex === index}
				<form
					action=""
					method="post"
					class="m-1 flex flex-col gap-1"
					use:enhance={() => {
						return async ({ result, update }) => {
							await update();
							if (result.type === 'success') {
								editingIndex = -1;
							}
						};
					}}
				>
					<input type="hidden" name="id" value={tag.id} />
					<label class="input input-xs input-bordered flex items-center gap-2">
						<span class="font-bold">Name</span>
						<input
							type="text"
							class="grow"
							placeholder={tag.name}
							value={tag.name}
							name="name"
							use:focus
						/>
					</label>

					<label class="input input-xs input-bordered flex items-center gap-2">
						<span class="font-bold">Color</span>
						<input
							type="text"
							class="grow"
							bind:value={color}
							placeholder={tag.color}
							name="color"
						/>
						<input tabindex="0" type="color" class="h-5 w-4" bind:value={color} />
					</label>
					<div class="flex gap-1">
						<button class="btn btn-primary btn-xs grow">Save</button>
						<button
							class="btn btn-secondary btn-xs grow"
							onclick={() => {
								editingIndex = -1;
							}}>Dismiss</button
						>
					</div>
				</form>
			{:else}
				<TagBadge id={tag.id} />
				<button
					onclick={() => {
						editingIndex = index;
						color = tag.color;
					}}
				>
					<PenSVG class={'hidden size-4 group-hover:block'} />
				</button>
			{/if}
		</li>
	{/each}
</ul>
