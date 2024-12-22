import { error as renderError, fail } from '@sveltejs/kit';

export const load = async ({ params, locals: { supabase } }) => {
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

export const actions = {
	saveTags: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const selectedTags = formData.getAll('selectedTags');
		const blobId = formData.get('blobId');

		// first remove all tags
		const { error: deleteError } = await supabase.from('blob_tags').delete().eq('blob_id', blobId);
		// todo: add error message
		if (deleteError) {
			console.error(deleteError);
		}

		// then add the selected ones
		const { error: insertError } = await supabase
			.from('blob_tags')
			.insert(selectedTags.map((tagId) => ({ blob_id: blobId, tag_id: tagId })));
		// todo: add error message
		if (insertError) {
			console.error(insertError);
		}

		// todo: add success message
	},
	selectTag: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const tagId = formData.get('tagId');
		const blobId = formData.get('blobId');

		const { error } = await supabase.from('blob_tags').insert({ blob_id: blobId, tag_id: tagId });
		if (error) {
			return fail(422, {
				description: 'Could not set tag for blob',
				error: error.message
			});
		}
	},
	addTag: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const newTagName = formData.get('newTagName');
		const blobId = formData.get('blobId');

		const { data, error } = await supabase.from('tags').insert({ name: newTagName }).select();

		if (error) {
			return fail(422, {
				description: 'Could not create new tag',
				error: error.message
			});
		}

		const tagId = data[0].id;

		const { error: setTagError } = await supabase
			.from('blob_tags')
			.insert({ blob_id: blobId, tag_id: tagId });
		if (setTagError) {
			return fail(422, {
				description: 'Could not set tag for blob',
				error: setTagError.message
			});
		}
	}
};
