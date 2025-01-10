import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { filterBlobs } from '$lib/services/datastore';

export const load: PageServerLoad = async ({ url, depends, locals: { supabase } }) => {
	depends('supabase:db:blobs');

	const queryString = url.searchParams.get('q') || '';
	const tags = url.searchParams.getAll('tag').map(Number).filter(Number.isFinite);

	const { data: bookmarksData } = await filterBlobs(supabase, queryString, tags);

	return {
		bookmarksData
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
