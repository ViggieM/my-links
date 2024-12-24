import { SvelteMap } from 'svelte/reactivity';
import type { ObjectOption } from 'svelte-multiselect';
import { analogousGradient, getAccessibleColor, getRGBColor } from '$lib';

export const tags: Map<number, Tag> = new SvelteMap();
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

// todo: usage of this function should be replaced by getAncestors
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

export function getOrderedTags() {
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

	return result.map(optionFromTag);
}

function getBackgroundColor(r: number, g: number, b: number, a: number) {
	const { endColor1, endColor2 } = analogousGradient(r, g, b);
	const [fromR, fromG, fromB] = endColor1;
	const [toR, toG, toB] = endColor2;
	return `color: ${getAccessibleColor(r, g, b)};
          background: linear-gradient(90deg, rgba(${fromR},${fromG},${fromB},${a}) 0%,
          rgba(${toR},${toG},${toB},${a}) 100%)`;
}

function getTopLevelTagColor(tag: Tag) {
	let current: Tag | undefined = tag;
	const maxIter = 50;
	const defaultColor = `#ffffff`;
	for (let i = 0; i < maxIter; i++) {
		if (current === undefined) return defaultColor;
		if (current.color) return current.color;
		if (!current.parent_id) break;
		current = tags.get(current.parent_id);
	}
	return defaultColor;
}

export function optionFromTag(tag: Tag): ObjectOption {
	const [r, g, b] = getRGBColor(tag.color || getTopLevelTagColor(tag));
	const level = tag.level || 0;
	const { endColor1 } = analogousGradient(r, g, b, level * 2);
	const [R, G, B] = [...endColor1];
	const a = 0.8 - level / 20;

	return {
		id: tag.id,
		parent_id: tag.parent_id,
		label: tag.name,
		level: level,
		style: {
			option: getBackgroundColor(R, G, B, a),
			selected: getBackgroundColor(R, G, B, a)
		}
	};
}
