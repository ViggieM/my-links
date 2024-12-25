import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export const load: PageServerLoad = async ({ depends, locals: { supabase } }) => {
	depends('supabase:db:blobs');
	const { data: blobs } = await supabase
		.from('blobs')
		.select('title,uuid,url,notes,rating,blob_tags(tag_id)')
		.limit(50)
		.order('id');

	return {
		blobs: blobs ?? []
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
