import type { SupabaseClient } from '@supabase/supabase-js';
import { areTagsLoaded, tags } from '$lib/stores/tags.svelte';
import { getRandomColor } from '$lib';

export async function loadAllTagsFromSupabase(supabase: SupabaseClient) {
	if (!areTagsLoaded) {
		const { data, error } = await supabase.from('tags').select('id,name,parent_id,color');

		if (error) {
			// todo: handle error
			console.log(error);
			return;
		}

		for (const tag of data) {
			if (tag.color === null && tag.parent_id === null) tag.color = getRandomColor();
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
