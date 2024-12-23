<script lang="ts">
	import { getAncestors, getDescendants, tags } from '$lib/stores/tags.svelte';
	import TagSlot from '$lib/components/TagSlot.svelte';
	import MultiSelect, { type ObjectOption } from 'svelte-multiselect';
	import TagList from '$lib/components/tagList.svelte';

	const { blob, selectedTagIds, supabase } = $props();
	const options: ObjectOption[] = $derived.by(() => {
		return [...tags.values()].map(optionFromTag);
	});
	let selected: ObjectOption[] = $state(
		[...tags.values()].filter((tag) => selectedTagIds.has(tag.id)).map(optionFromTag)
	);

	$effect(() => {
		selected = [...tags.values()].filter((tag) => selectedTagIds.has(tag.id)).map(optionFromTag);
	});

	function optionFromTag(tag: Tag): ObjectOption {
		return {
			id: tag.id,
			label: tag.name
		};
	}

	async function onAdd(evt) {
		// todo: wenn man ein tag hinzufügt, dann sollte hier auch berücksichtigt werden dass
		//  parent tags deselektiert werden
		let tagId = evt.detail.option.id;
		if (!tagId) {
			const name = evt.detail.option.label;
			const { data: tag } = await supabase
				.from('tags')
				.insert({ name: name })
				.select()
				.maybeSingle();
			evt.detail.option.id = tag.id;
			tags.set(tag.id, tag);
			tagId = tag.id;
		}
		selectedTagIds.add(tagId);

		const tag = tags.get(tagId);
		for (let i of getAncestors(tag)) {
			selectedTagIds.delete(i);
		}
		for (let i of getDescendants(tag)) {
			selectedTagIds.delete(i);
		}

		selected = [...tags.values()].filter((tag) => selectedTagIds.has(tag.id)).map(optionFromTag);
	}

	async function onRemove(evt) {
		const tagId = evt.detail.option.id;
		selectedTagIds.delete(tagId);
	}
</script>

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

	<MultiSelect
		bind:selected
		{options}
		key={(opt: ObjectOption) => opt.id}
		outerDivClass="border-none w-full [&_.remove-all]:hidden"
		liSelectedClass="badge"
		allowUserOptions="append"
		--sms-placeholder-opacity="0.7"
		placeholder="no tags selected"
		selectedOptionsDraggable={false}
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
		<TagSlot {option}></TagSlot>
	</MultiSelect>
</div>

<TagList blobId={blob.id} {supabase} {selectedTagIds}></TagList>
