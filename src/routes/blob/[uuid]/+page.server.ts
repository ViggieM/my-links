import { error as renderError } from '@sveltejs/kit';

export const load = async ({ params, locals: { supabase } }) => {
	let { data, error } = await supabase
		.from('blobs')
		.select('id,title,url,notes,rating,blob_tags(tag_id,tags(name))')
		.eq('uuid', params.uuid);

	// todo: render error
	if (error) {
		console.error(error);
	}

	if (!data || data.length === 0) renderError(404, 'Not found');

	const blob = data[0];
	const blobTags = blob.blob_tags.map((tag) => tag.tag_id);

	return {
		blob,
		blobTags
	};
};

export const actions = {
	saveTags: async ({ request, params, locals: { supabase } }) => {
		const formData = await request.formData();
		const selectedTags = formData.getAll('selectedTags');
		const blobId = formData.get('blobId');

		// first remove all tags
		let { error: deleteError } = await supabase.from('blob_tags').delete().eq('blob_id', blobId);
		// todo: add error message
		if (deleteError) {
			console.error(deleteError);
		}

		// then add the selected ones
		let { error: insertError } = await supabase
			.from('blob_tags')
			.insert(selectedTags.map((tagId) => ({ blob_id: blobId, tag_id: tagId })));
		// todo: add error message
		if (insertError) {
			console.error(insertError);
		}

		// todo: add success message
	}
};
