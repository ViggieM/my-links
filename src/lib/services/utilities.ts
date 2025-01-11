import { Tag } from '$lib/stores/tags.svelte';
import { tags } from '$lib/stores/tags.svelte';

export class Bookmark {
	title: string;
	uuid: string;
	url: string;
	notes: string;
	rating: number | null = null;
	tags: Tag[] = [];

	constructor(data: BlobData) {
		this.title = data.title;
		this.uuid = data.uuid;
		this.url = data.url;
		this.notes = data.notes;
		this.rating = data.rating;
		if (data.blob_tags) {
			for (const tag of data.blob_tags) {
				const tagg = tags.get(tag.tag_id);
				if (tagg) this.tags.push(tagg);
			}
		}
	}
}
