import type { SupabaseClient } from '@supabase/supabase-js';
import { areTagsLoaded, tags, Tag } from '$lib/stores/tags.svelte';

export async function loadAllTagsFromSupabase(supabase: SupabaseClient) {
	if (!areTagsLoaded) {
		const { data, error } = await supabase.from('tags').select('id,name,parent_id,color');

		if (error) {
			// todo: handle error
			console.log(error);
			return;
		}

		for (const tag of data) {
			tags.set(tag.id, new Tag(tag));
		}
	}
}

export async function setBlobTags(supabase: SupabaseClient, blobId: number, tagIds: number[]) {
	await supabase.from('blob_tags').delete().eq('blob_id', blobId);
	await supabase
		.from('blob_tags')
		.insert(tagIds.map((tagId) => ({ blob_id: blobId, tag_id: tagId })));
}

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
