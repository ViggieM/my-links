import { fail } from '@sveltejs/kit';

export const actions = {
	create: async ({ request, params, locals: { supabase } }) => {
		const formData = await request.formData();
		const title = formData.get('title');
		const url = formData.get('url');
		const rating = formData.get('rating');
		const notes = formData.get('notes');

		console.log(title, url, rating, notes);

		const { data, error } = await supabase
			.from('blobs')
			.insert([{ title, url, notes, rating: Number(rating) }])
			.select();

		if (error) {
			return fail(422, {
				description: 'Could not save blob',
				error: error.message
			});
		}

		console.log(data);
	}
};
