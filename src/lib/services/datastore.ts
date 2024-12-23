import type { SupabaseClient } from '@supabase/supabase-js';
import { areTagsLoaded, tags } from '$lib/stores/tags.svelte';

export async function loadAllTagsFromSupabase(supabase: SupabaseClient) {
	if (!areTagsLoaded) {
		const { data, error } = await supabase.from('tags').select('id,name,parent_id');

		if (error) {
			// todo: handle error
			console.log(error);
			return;
		}

		for (const tag of data) {
			tags.set(tag.id, tag);
		}
	}
}

export async function setBlobTags(supabase: SupabaseClient, blobId: number, tagIds: number[]) {
	await supabase.from('blob_tags').delete().eq('blob_id', blobId);
	await supabase
		.from('blob_tags')
		.insert(tagIds.map((tagId) => ({ blob_id: blobId, tag_id: tagId })));
}
