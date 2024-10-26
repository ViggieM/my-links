<script>
	import { tags, blobTagsController, getChildrenIds } from '$lib/stores/tags.svelte.js';

	let { data } = $props();

	// https://svelte.dev/docs/kit/state-management#Using-stores-with-context
	// das könnte ich machen, um nicht supabase überall einzutragen
	const { blob, blobTags } = data;

	const tagsController = blobTagsController(blobTags);
</script>

<h1>{blob.title}</h1>

<ul>
	{#each tagsController.getSelectedTags() as tag}
		<li>{tag.name}</li>
	{/each}
</ul>

{#snippet tagButton(tagId)}
  {#if tagsController.visibleTags.has(tagId)}
    {@const tag = tags.get(tagId)}
    <li><button onclick={() => {tagsController.addTag(tag.id)}}>{tag.name}</button></li>
    {@const children = getChildrenIds(tagId)}
    {#if children.length > 0}
      <ul>
        {#each children as childTagId}
          {@render tagButton(childTagId)}
        {/each}
      </ul>
    {/if}
  {/if}
{/snippet}

<ul>
	{#each tagsController.topLevelTags as tagId}
    {@render tagButton(tagId)}
	{/each}
</ul>
