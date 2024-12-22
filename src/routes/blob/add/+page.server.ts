import { fail, redirect } from '@sveltejs/kit';

export const actions = {
	create: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const title = formData.get('title');
		const url = formData.get('url');
		const rating = formData.get('rating');
		const notes = formData.get('notes');

		const { data, error } = await supabase
			.from('blobs')
			.insert([{ title, url, notes, rating: Number(rating) }])
			.select()
			.maybeSingle();

		if (error) {
			return fail(422, {
				description: 'Could not save blob',
				error: error.message
			});
		}

		const uuid = data.uuid;
		redirect(302, `/blob/${uuid}`);
	}
};
