import { fail } from '@sveltejs/kit';

export const load = async ({ locals: { supabase } }) => {
	const { data } = await supabase.storage.from('splendid-hummingbird').list('public');
	const files = data.map(({ name }) => `public/${name}`);
	const videos = [];
	for (let i = 0; i < files.length; i++) {
		const { data, error } = await supabase.storage
			.from('splendid-hummingbird')
			.createSignedUrl(files[i], 3600);
		if (error) console.log(error);
		if (data) videos.push(data);
	}
	const { data: countries } = await supabase
		.from('countries')
		.select('name')
		.limit(5)
		.order('name');
	return {
		countries: countries ?? [],
		videos
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
