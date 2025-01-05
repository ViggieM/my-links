import { SvelteMap } from 'svelte/reactivity';

export const tags: SvelteMap<number, Tag> = new SvelteMap();
// $derived(tags): Cannot export derived state from a module.
export const areTagsLoaded = $state(false);

export class Tag {
	readonly id: number;
	readonly parentId: number | null;
	name: string;
	readonly #color?: string;
	readonly defaultColor = `#ffffff`;

	constructor(tag: TagData) {
		this.id = tag.id;
		this.name = tag.name;
		this.parentId = tag.parent_id;
		this.#color = tag.color;
	}

	get parent() {
		if (this.parentId === null) return;
		return tags.get(this.parentId);
	}

	get ancestors(): Tag[] {
		const result: Tag[] = [];
		let current = this.parent;
		while (current) {
			result.push(current);
			current = current.parent;
		}
		return result;
	}

	get descendants() {
		let result = new Set<Tag>();
		for (const tag of this.children) {
			result.add(tag);
			result = result.union(tag.descendants);
		}
		return result;
	}

	get siblings() {
		return [...tags.values()].filter((i) => i.parentId === this.parentId && i.id !== this.id);
	}

	get level() {
		return this.ancestors.length;
	}

	get color(): string {
		if (this.#color) return this.#color;
		if (this.parent) return this.parent.color;
		return this.defaultColor;
	}

	get children() {
		return Array.from(tags.values()).filter((el) => el.parentId === this.id);
	}
}

export function getVisibleTagIds(selectedTagIds: Set<number>): Set<number> {
	let result: Set<number> = new Set();

	for (const id of selectedTagIds) {
		result.add(id);
		const tag = tags.get(id);

		if (!tag) continue;

		// parents are visible
		const ancestors = new Set(tag.ancestors.map((i) => i.id));

		// all siblings and siblings of the parents are visible
		const siblings = [...tags.values()]
			.filter((i) => i.parentId && ancestors.has(i.parentId))
			.map((i) => i.id);

		// first level children are visible
		const children = tag.children.map((i) => i.id);

		result = new Set([...result, ...ancestors, ...siblings, ...children]);
	}

	return result;
}

export function orderTags(tags: SvelteMap<number, Tag>) {
	const result: Tag[] = [];
	const topLevelTags = Array.from(tags.values()).filter((el) => el.parent === undefined);
	for (const tag of topLevelTags) {
		result.push(tag);
		appendChildren(tag);
	}

	function appendChildren(tag: Tag) {
		for (const child of tag.children) {
			result.push(child);
			appendChildren(child);
		}
	}

	return result;
}
