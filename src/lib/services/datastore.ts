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
