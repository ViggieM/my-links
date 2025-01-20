<script lang="ts">
	import TagBadge from '$lib/components/tagBadge.svelte';
	import BlobDetails from '$lib/components/blobDetails.svelte';
	import Aside from './aside.svelte';

	const { bookmark } = $props();

	let isOpen = $state(false);
</script>

{#snippet content()}
	<BlobDetails {bookmark} />
{/snippet}

<Aside bind:isOpen {content}>
	<button class="flex h-full w-full flex-col" onclick={() => (isOpen = true)}>
		{#if bookmark.url}
			<a
				href={bookmark.url}
				target="_blank"
				aria-label="external link"
				class="text-sm text-gray-600"
			>
				{bookmark.title}
			</a>
		{/if}
		<div class="mt-2 flex flex-wrap gap-1">
			{#each bookmark.tags as tag (tag.id)}
				<TagBadge {tag} />
			{/each}
		</div>
	</button>
</Aside>
