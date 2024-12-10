<script>
	let { data } = $props();
	let { supabase, user, blobs } = $derived(data);

	let logout = $derived(async () => {
		const { error } = await supabase.auth.signOut();
		if (error) {
			console.error(error);
		}
	});
</script>

{#if !user}
	<form action="?/login" method="POST">
		<button class="btn">Login</button>
	</form>
{:else}
	<button class="btn" onclick={logout}>Logout</button>
{/if}

<div class="overflow-x-auto">
	<table class="table">
		<thead>
			<tr>
				<th>Title</th>
			</tr>
		</thead>
		<tbody>
			{#each blobs as blob}
				<tr>
					<td><a href="/blob/{blob.uuid}">{blob.title}</a></td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
