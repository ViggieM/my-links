<script>
	export let data;
	$: ({ supabase, user, blobs } = data);

  $: logout = async () => {
		const { error } = await supabase.auth.signOut();
		if (error) {
			console.error(error);
		}
	};
</script>

{#if !user}
  <form action="?/login" method="POST">
	  <button>Login</button>
  </form>
{:else }
  <button on:click={logout}>Logout</button>
{/if}

<ul>
	{#each blobs as blob}
		<li><a href="/blob/{blob.uuid}">{blob.title}</a></li>
	{/each}
</ul>
