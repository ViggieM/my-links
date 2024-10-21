import { fail } from '@sveltejs/kit';

export const load = async ({ locals: { supabase } }) => {
	const { data: countries } = await supabase
		.from('countries')
		.select('name')
		.limit(5)
		.order('name');
	return {
		countries: countries ?? []
	};
};

export const actions = {
	upload: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const file = formData.get('file');
		const { data, error } = await supabase.storage
			.from('splendid-hummingbird')
			.upload(`private/${file.name}`, file);
		if (error) {
			return fail(422, {
				error: error.message
			});
		} else {
			console.log(data);
			return { success: true };
		}
	}
};
