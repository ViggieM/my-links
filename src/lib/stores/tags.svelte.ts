import type { SupabaseClient } from '@supabase/supabase-js';
import { SvelteSet, SvelteMap } from 'svelte/reactivity';

type Tag = {
	id: number;
	parent_id: number;
	name: string;
};

type BlobTagsController = {
	selectedTags: Set<number>;
	visibleTags: Set<number>;
	topLevelTags: Set<number>;
	addTag: (id: number) => void;
	getSelectedTags: () => Tag[];
};

export const tags: Map<number, Tag> = new SvelteMap();
export let areTagsLoaded = $state(false);

export async function loadAllTagsFromSupabase(supabase: SupabaseClient) {
	if (!areTagsLoaded) {
		const { data, error } = await supabase.from('tags').select('id,name,parent_id');

		if (error) {
			// todo: handle error
			console.log(error);
			return;
		}

		for (let tag of data) {
			tags.set(tag.id, tag);
		}
	}
}

function getParentIds(tagId: number): number[] {
	const parents = [];
	let current = tags.get(tagId);

	while (current && current.parent_id !== undefined) {
		parents.push(current.parent_id);
		current = tags.get(current.parent_id);
	}

	return parents;
}

export function getChildrenIds(tagId: number): number[] {
	const children = [...tags.values()].filter((i) => i.parent_id === tagId);
	return children.map((i) => i.id);
}

export function blobTagsController(blobTags: number[]): BlobTagsController {
	let selectedTags = new SvelteSet(blobTags);
	let visibleTags = $derived.by(() => {
		const result = [];
		for (let id of selectedTags) {
			result.push(id);

			// parents are visible
			const parents = getParentIds(id);
			result.push(...parents);

			// all siblings and siblings of the parents are visible
			const siblings = [...tags.values()].filter((i) => parents.includes(i.parent_id));
			result.push(...siblings.map((el) => el.id));

			// first level children are visible
			const children = [...tags.values()].filter((i) => i.parent_id === id);
			result.push(...children.map((el) => el.id));
		}

		return new Set(result);
	});
	let topLevelTags = $derived.by(() => {
		const _tags = [...tags.values()].filter((i) => i.parent_id === null);
		return new Set(_tags.map((el) => el.id));
	});

	function removeChildren(tag: Tag) {
		if (Array.from(tags.values()).find((el) => el.parent_id === tag.id)) {
			for (let childTag of Array.from(tags.values()).filter((el) => el.parent_id === tag.id)) {
				selectedTags.delete(childTag.id);
				removeChildren(childTag);
			}
		}
	}

	function addTag(id: number) {
		// select / unselect Tag
		const tag = tags.get(id);
		if (tag === undefined) return;

		// remove all parent tags if a child tag is selected
		if (tag.parent_id !== null) {
			let current: Tag | undefined = tag;
			while (current !== undefined && current.parent_id !== null) {
				selectedTags.delete(current.parent_id);
				current = tags.get(current.parent_id);
			}
		}

		// remove all child tags if a parent is selected
		removeChildren(tag);

		// set currently clicked tag as a selected tag if it was not previously selected, else unselect it
		selectedTags.has(tag.id) ? selectedTags.delete(tag.id) : selectedTags.add(tag.id);
	}

	function getSelectedTags(): Tag[] {
		return [...selectedTags].map((id) => tags.get(id)).filter((value) => value !== undefined);
	}

	return {
		selectedTags,
		visibleTags,
		topLevelTags,
		addTag,
		getSelectedTags
	};
}
