import { error as renderError } from '@sveltejs/kit';

export const load = async ({ params, locals: { supabase }, depends }) => {
	depends('supabase:auth');
	const { data: blob, error } = await supabase
		.from('blobs')
		.select('id,title,url,notes,rating,blob_tags(tag_id,tags(name))')
		.eq('uuid', params.uuid)
		.maybeSingle();

	// todo: render error
	if (error) {
		console.error(error);
	}

	if (!blob) renderError(404, 'Not found');

	const blobTags = blob.blob_tags.map((tag) => tag.tag_id);

	return {
		blob,
		blobTags
	};
};
