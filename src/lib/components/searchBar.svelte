<script lang="ts">
	import { tags, orderTags } from '$lib/stores/tags.svelte';
	import MultiSelect, { type ObjectOption } from 'svelte-multiselect';
	import TagSlot from '$lib/components/TagSlot.svelte';
	import { optionFromTagg } from '$lib';

	let { value = $bindable() } = $props();

	const orderedTags = orderTags(tags);
	const options: ObjectOption[] = orderedTags.map(optionFromTagg);
	let selected: ObjectOption[] = $state([]);
	let isOpen = $state(false);
	let selectInput: HTMLInputElement | null = $state(null);
	let searchInput: HTMLInputElement | null = $state(null);

	function onkeyup(evt: KeyboardEvent) {
		if (evt.key === '#') {
			selectInput?.focus();
		}
	}

	function trimToLastHash(input: string) {
		const lastHashIndex = input ? input.lastIndexOf('#') : -1;
		return lastHashIndex === -1 ? input : input.slice(0, lastHashIndex).trim();
	}
</script>

<div class="p-2">
	<label class="input input-bordered flex w-full cursor-text items-stretch pr-0">
		<input
			name="q"
			class="grow outline-none"
			autocomplete="off"
			placeholder="Search"
			bind:this={searchInput}
			bind:value
			{onkeyup}
		/>

		<button
			class="p-3 hover:bg-secondary/50 hover:text-secondary-content"
			title="Search"
			aria-label="Search"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="size-6"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
				/>
			</svg>
		</button>

		<button
			class="rounded-e-full p-3 pr-4 hover:bg-secondary/50 hover:text-secondary-content"
			title="Create"
			aria-label="Create"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="size-6"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
				/>
			</svg>
		</button>
	</label>
</div>

<div class="flex items-center px-2">
	Tags:
	<MultiSelect
		{options}
		outerDivClass="border-none [&_.remove-all]:hidden"
		liOptionClass="badge opacity-70"
		liSelectedClass="badge"
		ulOptionsClass="p-2 flex gap-1.5 flex-col"
		--sms-placeholder-opacity="0.7"
		placeholder="no tags selected"
		closeDropdownOnSelect={true}
		bind:input={selectInput}
		bind:open={isOpen}
		bind:selected
		on:add={() => {
			value = trimToLastHash(value);
			searchInput?.focus();
		}}
		let:option
	>
		<span slot="expand-icon"></span>
		<TagSlot {option}></TagSlot>
	</MultiSelect>
</div>

{#each selected as selectedTag}
	<input type="hidden" name="tag" value={selectedTag.id} />
{/each}
