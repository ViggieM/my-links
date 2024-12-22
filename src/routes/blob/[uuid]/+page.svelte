<script lang="ts">
	import SelectedTagsList from '$lib/components/selectedTagsList.svelte';
	import TagList from '$lib/components/tagList.svelte';
	import BlobUrl from '$lib/components/blobUrl.svelte';
	import SearchTagsForm from '$lib/components/searchTagsForm.svelte';
	import { SvelteSet } from 'svelte/reactivity';
  import MultiSelect from 'svelte-multiselect';
  import TagSlot from '$lib/components/TagSlot.svelte';
  import { tags } from '$lib/stores/tags.svelte';


	let { data, form } = $props();

	// https://svelte.dev/docs/kit/state-management#Using-stores-with-context
	// das könnte ich machen, um nicht supabase überall einzutragen
	const { supabase, blob, blobTags } = data;

  function optionFromTag(tag: Tag) {
    return {
        id: tag.id,
        label: tag.name
      }
  }
	const selectedTagIds: SvelteSet<number> = new SvelteSet(blobTags);
  const options = $derived.by(() => {
    return [...tags.values()].map(optionFromTag)
  })
  let selected = $state([...tags.values()].filter(tag => selectedTagIds.has(tag.id)).map(optionFromTag))

  async function onAdd(evt) {
    let tagId = evt.detail.option.id
    if (!tagId) {
        const name = evt.detail.option.label
        const { data: tag } = await supabase.from('tags').insert({ name: name }).select().maybeSingle()
        evt.detail.option.id = tag.id
        tags.set(tag.id, tag)
        tagId = tag.id
    }
    selectedTagIds.add(tagId)
    await supabase
			.from('blob_tags')
			.insert({ blob_id: blob.id, tag_id: tagId })
  }

  async function onRemove(evt) {
    const tagId = evt.detail.option.id
    await supabase
			.from('blob_tags')
			.delete()
			.match({ blob_id: blob.id, tag_id: tagId });
    selectedTagIds.delete(tagId)
  }
</script>

<article>
	<h1 class="mb-4 text-4xl">{blob.title}</h1>
	<div class="flex flex-col gap-2">
		<SelectedTagsList blobId={blob.id} {selectedTagIds} {supabase}></SelectedTagsList>
		<BlobUrl {blob} />

    <div class="my-4">
      <MultiSelect
        bind:selected
        options={options}
        key={opt => opt.id}
        outerDivClass="border-none"
        allowUserOptions="append"
        --sms-placeholder-opacity="0.7"
        placeholder="no tags selected"
        on:add={onAdd}
        on:remove={onRemove}
        let:option
      >
        <span slot="expand-icon"></span>
        <TagSlot {option}></TagSlot>
      </MultiSelect>
    </div>

		<div class="mt-4">
			<SearchTagsForm {selectedTagIds} {form} {supabase} blobId={blob.id} />
		</div>
	</div>
</article>

<div class="mt-4">
	<TagList blobId={blob.id} {supabase} {selectedTagIds}></TagList>
</div>
