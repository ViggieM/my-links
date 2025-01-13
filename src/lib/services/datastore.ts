import type { SupabaseClient } from '@supabase/supabase-js';
import { Tag, tags } from '$lib/stores/tags.svelte';
import { Bookmark } from '$lib/services/utilities';
import { debounce } from '$lib';

export async function loadTagsFromSupabase(supabase: SupabaseClient) {
	const { data, error } = await supabase.from('tags').select('id,name,parent_id,color');

	if (error) {
		console.log(error);
		return;
	}

	for (const tag of data) {
		tags.set(tag.id, new Tag(tag));
	}
}

export async function setBlobTags(supabase: SupabaseClient, blobId: number, tagIds: number[]) {
	await supabase.from('blob_tags').delete().eq('blob_id', blobId);
	await supabase
		.from('blob_tags')
		.insert(tagIds.map((tagId) => ({ blob_id: blobId, tag_id: tagId })));
}

export async function filterBlobs(
	supabase: SupabaseClient,
	queryString: string = '',
	tags: number[] = []
) {
	let query = supabase
		.from('blobs')
		.select('id,title,uuid,url,notes,rating,blob_tags(tag_id)')
		.limit(50)
		.order('id');

	if (queryString) {
		query = query.ilike('title', `%${queryString}%`);
	}

	if (tags.length > 0) {
		const { data: matchedBlobs } = await supabase
			.from('blobs_and_ids')
			.select('id,tag_ids')
			.overlaps('tag_ids', tags);
		const blobIds = matchedBlobs ? matchedBlobs.map((el) => el.id) : [];
		query = query.in('id', blobIds);
	}

	const { data } = await query;
	return data?.map((el) => new Bookmark(el)) ?? [];
}

export const debouncedFilterBlobs = debounce(filterBlobs, 300);
