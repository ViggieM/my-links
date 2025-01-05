import { SvelteMap } from 'svelte/reactivity';

export const tags: SvelteMap<number, Tag> = new SvelteMap();
// $derived(tags): Cannot export derived state from a module.
export const areTagsLoaded = $state(false);

export function getAncestors(tag: Tag): Set<number> {
	const result: Set<number> = new Set();

	// remove all parent tags if a child tag is selected
	if (tag.parent_id !== null) {
		let current: Tag | undefined = tag;
		while (current !== undefined && current.parent_id !== null) {
			result.add(current.parent_id);
			current = tags.get(current.parent_id);
		}
	}
	return result;
}

export function getDescendants(tag: Tag, ancestors: Set<number> = new Set()) {
	if (Array.from(tags.values()).find((el) => el.parent_id === tag.id)) {
		for (const childTag of Array.from(tags.values()).filter((el) => el.parent_id === tag.id)) {
			ancestors.add(childTag.id);
			ancestors = ancestors.union(getDescendants(childTag, ancestors));
		}
	}
	return ancestors;
}

export function getVisibleTagIds(selectedTagIds: number[]): Set<number> {
	const result: Set<number> = new Set();

	for (const id of selectedTagIds) {
		result.add(id);
    const tag = tags.get(id)

    if (!tag) continue

		// parents are visible
		const parents = getAncestors(tag);
		parents.forEach((parentId) => result.add(parentId));

		// all siblings and siblings of the parents are visible
		const siblings = [...tags.values()].filter((i) => i.parent_id && parents.has(i.parent_id));
		siblings.forEach((sibling) => result.add(sibling.id));

		// first level children are visible
		const children = [...tags.values()].filter((i) => i.parent_id === id);
		children.forEach((child) => result.add(child.id));
	}

	return result;
}

export function orderTags(tags: SvelteMap<number, Tag>) {
	const result: Tag[] = [];

	function appendChildren(tag: Tag) {
		const children = [...tags.values()].filter((i) => i.parent_id === tag.id);
		for (const child of children) {
			child.level = (tag.level || 0) + 1;
			result.push(child);
			appendChildren(child);
		}
	}

	for (const tag of tags.values()) {
		if (tag.parent_id === null) {
			tag.level = 0;
			result.push(tag);
			appendChildren(tag);
		}
	}

	return result;
}
