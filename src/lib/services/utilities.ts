import { Tag } from '$lib/stores/tags.svelte';
import { tags } from '$lib/stores/tags.svelte';

export class Bookmark {
	id: number;
	title: string;
	uuid: string;
	url: string;
	notes: string;
	rating: number | null = null;
	tags: Tag[] = [];

	constructor(data: BlobData) {
		this.id = data.id;
		this.title = data.title;
		this.uuid = data.uuid;
		this.url = data.url;
		this.notes = data.notes;
		this.rating = data.rating;
		if (data.blob_tags?.length) {
			for (const { tag_id } of data.blob_tags) {
				const tag = tags.get(tag_id);
				if (tag) this.tags.push(tag);
			}
		}
	}
}
