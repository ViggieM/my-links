<!-- todo: clicking on outer div is inconsistently focusing on the span -->

<script lang="ts">
  import { tags, optionFromTag, orderTags } from '$lib/stores/tags.svelte';
  import MultiSelect, { type ObjectOption } from 'svelte-multiselect';
  import TagSlot from '$lib/components/TagSlot.svelte';
  import TagBadge from '$lib/components/tagBadge.svelte';

  const orderedTags = orderTags(tags);
  const options: ObjectOption[] = orderedTags.map(optionFromTag);
  let selected: ObjectOption[] = $state([]);
  let isOpen = $state(false);
  let selectInput: HTMLInputElement | null = $state(null)
  let searchInput: HTMLInputElement | null = $state(null)
  let value = $state('')
  let isLastKeySpace = $state(false)

  function onclick(evt: Event) {
    document.getElementById('search-bar-input')?.focus()
  }

  function onkeyup(evt: KeyboardEvent) {
    if (evt.key === ' ') {
      isLastKeySpace = true
      return
    }
    if (evt.key === '#' && (isLastKeySpace || value === '#')) {
      isOpen = true
      selectInput?.focus()
    }
    isLastKeySpace = false
  }

  function trimToLastHash(input: string) {
    const lastHashIndex = input.lastIndexOf('#');
    return lastHashIndex === -1 ? input : input.slice(0, lastHashIndex).trim();
  }

  function onAdd(evt) {
    value = trimToLastHash(value)
    searchInput?.focus()
    console.log(value)
  }
</script>

<div class="p-2">
  <div class="input input-bordered flex items-center cursor-text" {onclick}>
    <ul class="flex">
      {#each selected as selectedTag}
        <li><TagBadge id={selectedTag.id} /></li>
      {/each}
    </ul>
    <input bind:this={searchInput} bind:value id="search-bar-input" class="outline-none" {onkeyup} >
    <MultiSelect
    {options}
    outerDivClass="border-none [&_.remove-all]:hidden"
	  liSelectedClass="hidden"
    liOptionClass="badge"
    ulOptionsClass="p-2 flex gap-1.5 flex-col"
    closeDropdownOnSelect={true}
    bind:input={selectInput}
    bind:open={isOpen}
    bind:selected
    on:add={onAdd}
    let:option
  >
    <span slot="expand-icon"></span>
    <TagSlot {option}></TagSlot>
  </MultiSelect>
  </div>
</div>
