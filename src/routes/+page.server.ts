import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export const load: PageServerLoad = async ({ url, depends, locals: { supabase } }) => {
	depends('supabase:db:blobs');

  const queryString = url.searchParams.get('q') || ''
  const tagIds = url.searchParams.getAll('tag') || []

  let query = supabase
		.from('blobs')
		.select('title,uuid,url,notes,rating,blob_tags(tag_id)')
		.limit(50)
		.order('id')

  if (queryString) {
    query = query.ilike('title', `%${queryString}%`)
  }

  if (tagIds.length > 0) {
    // const tagFilter = `blob_tags.tag_id.{${tagIds.map(i => `"${i}"`).join(',')}}`
    query = query.in('blob_tags.tag_id', tagIds)
  }

	const { data: bookmarksData } = await query;

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
