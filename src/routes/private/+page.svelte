<script>
	import { invalidate } from '$app/navigation';

	export let data;
	$: ({ notes, supabase, user } = data);

	let handleSubmit;
	$: handleSubmit = async (evt) => {
		evt.preventDefault();
		if (!evt.target) return;

		const form = evt.target;
		const note = new FormData(form).get('note') ?? '';
		if (!note) return;

		const { error } = await supabase.from('notes').insert({ note, user_id: user.id });
		if (error) console.error(error);

		invalidate('supabase:db:notes');
		form.reset();
	};
</script>

<h1>Private page for user: {user?.email}</h1>
<h2>Notes</h2>
<ul>
	{#each notes as note}
		<li>{note.note}</li>
	{/each}
</ul>
<form on:submit={handleSubmit}>
	<label for="note">Add a note</label>
	<input type="text" name="note" />
</form>
