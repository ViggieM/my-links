import { SvelteMap } from 'svelte/reactivity';

export const tags: Map<number, Tag> = new SvelteMap();
export const areTagsLoaded = $state(false);

export function addTag(selectedTags: Set<number>, id: number) {
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
	removeChildren(selectedTags, tag);

	// set currently clicked tag as a selected tag if it was not previously selected, else unselect it
	if (selectedTags.has(tag.id)) {
		selectedTags.delete(tag.id);
	} else {
		selectedTags.add(tag.id);
	}
}

export function getParentIds(tagId: number): number[] {
	const parents = [];
	let current = tags.get(tagId);

	while (current && current.parent_id !== undefined) {
		if (current.parent_id === null) break;
		parents.push(current.parent_id);
		current = tags.get(current.parent_id);
	}

	return parents;
}

export function getChildrenIds(tagId: number): number[] {
	const children = [...tags.values()].filter((i) => i.parent_id === tagId);
	return children.map((i) => i.id);
}

function removeChildren(selectedTags: Set<number>, tag: Tag) {
	if (Array.from(tags.values()).find((el) => el.parent_id === tag.id)) {
		for (const childTag of Array.from(tags.values()).filter((el) => el.parent_id === tag.id)) {
			selectedTags.delete(childTag.id);
			removeChildren(selectedTags, childTag);
		}
	}
}

export function getVisibleTagIds(selectedTagIds: number[]): Set<number> {
	const result: Set<number> = new Set();

	for (const id of selectedTagIds) {
		result.add(id);

		// parents are visible
		const parents = getParentIds(id);
		parents.forEach((parentId) => result.add(parentId));

		// all siblings and siblings of the parents are visible
		const siblings = [...tags.values()].filter((i) => i.parent_id && parents.includes(i.parent_id));
		siblings.forEach((sibling) => result.add(sibling.id));

		// first level children are visible
		const children = [...tags.values()].filter((i) => i.parent_id === id);
		children.forEach((child) => result.add(child.id));
	}

	return result;
}
