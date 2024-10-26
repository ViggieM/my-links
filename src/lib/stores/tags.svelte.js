import { SvelteSet, SvelteMap } from 'svelte/reactivity';

/**
 * @type {Map<number, {id: number, parent_id: number, name: string}>}
 */
export const tags = new SvelteMap();
export let areTagsLoaded = $state(false);

export async function loadAllTagsFromSupabase(supabase) {
	if (!areTagsLoaded) {
		const { data, error } = await supabase.from('tags').select('id,name,parent_id');
		for (let tag of data) {
			tags.set(tag.id, tag);
		}
	}
}

/**
 * @param {number} tagId
 * @returns {number[]}
 */
function getParentIds(tagId) {
	const parents = [];
	let current = tags.get(tagId);

	while (current && current.parent_id !== undefined) {
		parents.push(current.parent_id);
		current = tags.get(current.parent_id);
	}

	return parents;
}

/**
 * @param {number} tagId
 * @returns {number[]}
 */
export function getChildrenIds(tagId) {
	const children = [...tags.values()].filter((i) => i.parent_id === tagId);
	return children.map((i) => i.id);
}

/**
 * @param {number[]} blobTags
 * @returns {object}
 */
export function blobTagsController(blobTags) {
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
			result.push(...siblings.map(el => el.id));

			// first level children are visible
			const children = [...tags.values()].filter((i) => i.parent_id === id);
			result.push(...children.map(el => el.id));
		}

		return new Set(result);
	});
  let topLevelTags = $derived.by(() => {
    const _tags = [...tags.values()].filter((i) => i.parent_id === null)
    return new Set(_tags.map(el => el.id))
  })

  function removeChildren(tag) {
		if (Array.from(tags.values()).find((el) => el.parent_id === tag.id)) {
			for (let childTag of Array.from(tags.values()).filter((el) => el.parent_id === tag.id)) {
				selectedTags.delete(childTag.id);
				removeChildren(childTag);
			}
		}
	}

	function addTag(id) {
    // select / unselect Tag
    const tag = tags.get(id)
		// remove all parent tags if a child tag is selected
		if (tag.parent_id !== null) {
			let current = tag;
			while (current !== undefined && current.parent_id !== null) {
				selectedTags.delete(current.parent_id);
				current = tags.get(current.parent_id);
			}
		}

    // remove all child tags if a parent is selected
    removeChildren(tag)

    // set currently clicked tag as a selected tag if it was not previously selected, else unselect it
		selectedTags.has(tag.id) ? selectedTags.delete(tag.id) : selectedTags.add(tag.id);
	}

	function getSelectedTags() {
		return [...selectedTags].map((id) => tags.get(id)).filter((value) => value !== undefined);
	}

	return {
		selectedTags,
		visibleTags,
    topLevelTags,
		addTag,
		getSelectedTags,
	};
}
