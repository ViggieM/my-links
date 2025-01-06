import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export const load: PageServerLoad = async ({ url, depends, locals: { supabase } }) => {
	depends('supabase:db:blobs');

  const query = url.searchParams.get('q') || ''
  const tagIds = url.searchParams.getAll('tag') || []
  // const tagFilter = `blob_tags.tag_id.{${tagIds.map(i => `"${i}"`).join(',')}}`
	const { data: bookmarksData } = await supabase
		.from('blobs')
		.select('title,uuid,url,notes,rating,blob_tags(tag_id)')
    .ilike('title', `%${query}%`)
    // .or(tagFilter)
		.limit(50)
		.order('id');

	return {
		bookmarksData,
	};
};

export const actions = {
	login: async ({ locals: { supabase } }) => {
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: 'google',
			options: {
				redirectTo: `${env.URL}/auth/callback`
			}
		});
		if (error) {
			console.error(error);
			redirect(303, '/auth/error');
		} else if (data.url) {
			redirect(303, data.url);
		} else {
			redirect(303, '/');
		}
	}
};
