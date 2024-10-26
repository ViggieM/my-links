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
		<button>Login</button>
	</form>
{:else}
	<button onclick={logout}>Logout</button>
{/if}

<ul>
	{#each blobs as blob}
		<li><a href="/blob/{blob.uuid}">{blob.title}</a></li>
	{/each}
</ul>
