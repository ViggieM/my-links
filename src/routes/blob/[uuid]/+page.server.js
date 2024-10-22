import { error as renderError } from '@sveltejs/kit';

export const load = async ({ params, locals: { supabase } }) => {
  let { data: blobs, error } = await supabase
    .from('blobs')
    .select('*')
    .eq('uuid', params.uuid);

  if (error) throw new Error(error.message)

  if (blobs.length > 0) {
    const blob = blobs[0]
    return {
      title: blob.title,
    };
  }

  renderError(404, 'Not found');
};
