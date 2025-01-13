<script lang="ts">
	import { getVisibleTagIds, tags, orderTags, Tag } from '$lib/stores/tags.svelte';
	import TagSlot from '$lib/components/TagSlot.svelte';
	import MultiSelect, { type ObjectOption } from 'svelte-multiselect';
	import { optionFromTag } from '$lib';

	const { selectedTagIds, supabase } = $props();
	const visibleTags = $derived(getVisibleTagIds(selectedTagIds));
	const orderedTags = orderTags(tags);
	const options: ObjectOption[] = orderedTags.map(optionFromTag);
	let selected: ObjectOption[] = $state(
		[...tags.values()].filter((tag) => selectedTagIds.has(tag.id)).map(optionFromTag)
	);

	$effect(() => {
		selected = [...tags.values()].filter((tag) => selectedTagIds.has(tag.id)).map(optionFromTag);
	});

	function filterFunc(opt: ObjectOption, searchText: string) {
		if (searchText) {
			return `${opt.label}`.toLowerCase().includes(searchText.toLowerCase());
		}
		return visibleTags.has(opt.id) || opt.parent_id === null;
	}

	async function onAdd(evt: CustomEvent) {
		let tagId = evt.detail.option.id;
		if (!tagId) {
			const name = evt.detail.option.label;
			const { data: tag } = await supabase
				.from('tags')
				.insert({ name: name })
				.select()
				.maybeSingle();
			evt.detail.option.id = tag.id;
			tags.set(tag.id, new Tag(tag));
			tagId = tag.id;
		}

		if (selectedTagIds.has(tagId)) {
			selectedTagIds.delete(tagId);
		} else {
			selectedTagIds.add(tagId);
			const tag = tags.get(tagId);
			if (!tag) return;
			for (let ancestor of tag.ancestors) {
				selectedTagIds.delete(ancestor.id);
			}
			for (let descendant of tag.descendants) {
				selectedTagIds.delete(descendant.id);
			}
		}
	}

	async function onRemove(evt: CustomEvent) {
		const tagId = evt.detail.option.id;
		selectedTagIds.delete(tagId);
	}
</script>

<MultiSelect
	outerDivClass="p-0 -ml-0.5 border-none w-full [&_.remove-all]:hidden"
	liSelectedClass="badge border-none shadow m-0 mr-1.5"
	liOptionClass="badge opacity-70"
	ulOptionsClass="p-2 flex gap-1.5 flex-wrap"
	allowUserOptions="append"
	--sms-placeholder-opacity="0.7"
	placeholder="no tags selected"
	bind:selected
	{options}
	key={(opt: ObjectOption) => opt.id}
	{filterFunc}
	selectedOptionsDraggable={false}
	closeDropdownOnSelect={false}
	duplicates={true}
	on:add={onAdd}
	on:remove={onRemove}
	let:option
>
	<span slot="expand-icon"></span>
	<span slot="remove-icon">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			class="size-4"
		>
			<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
		</svg>
	</span>
	<span slot="user-msg" class="text-sm">Create this tag...</span>
	<TagSlot {option}></TagSlot>
</MultiSelect>
