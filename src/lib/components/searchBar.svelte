<!-- todo: clicking on outer div is inconsistently focusing on the span -->

<script lang="ts">
  import { tags, optionFromTag, orderTags } from '$lib/stores/tags.svelte';
  import MultiSelect, { type ObjectOption } from 'svelte-multiselect';
  import TagSlot from '$lib/components/TagSlot.svelte';

  const orderedTags = orderTags(tags);
  const options: ObjectOption[] = orderedTags.map(optionFromTag);
  let selected: ObjectOption[] = $state([]);
  let isOpen = $state(false);
  let selectInput: HTMLInputElement | null = $state(null)
  let searchInput: HTMLInputElement | null = $state(null)
  let value = $state('')

  function onkeyup(evt: KeyboardEvent) {
    if (evt.key === '#') {
      selectInput?.focus()
    }
  }

  function trimToLastHash(input: string) {
    const lastHashIndex = input.lastIndexOf('#');
    return lastHashIndex === -1 ? input : input.slice(0, lastHashIndex).trim();
  }
</script>

<div class="p-2">
  <label class="input input-bordered flex items-center cursor-text">
    <input bind:this={searchInput} bind:value id="search-bar-input" class="outline-none" {onkeyup} autocomplete="off">
  </label>
</div>

<div class="px-2 flex items-center">
  Tags:
  <MultiSelect
  {options}
  outerDivClass="border-none [&_.remove-all]:hidden"
  liOptionClass="badge"
  liSelectedClass="badge"
  ulOptionsClass="p-2 flex gap-1.5 flex-col"
  --sms-placeholder-opacity="0.7"
  placeholder="no tags selected"
  closeDropdownOnSelect={true}
  bind:input={selectInput}
  bind:open={isOpen}
  bind:selected
  on:add={() => value = trimToLastHash(value)}
  on:close={()=>searchInput?.focus()}
  let:option
>
  <span slot="expand-icon"></span>
  <TagSlot {option}></TagSlot>
</MultiSelect>
</div>
