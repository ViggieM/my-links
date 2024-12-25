import type { Actions } from '@sveltejs/kit';

export const actions = {
	default: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const id = formData.get('id');
		const name = formData.get('name');
		const color = formData.get('color');

		await supabase.from('tags').update({ name, color }).eq('id', id).select();

		return {
			name,
			color
		};
	}
} satisfies Actions;
