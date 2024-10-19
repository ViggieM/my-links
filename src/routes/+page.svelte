<script>
	function signIn() {
		alert(import.meta.env.VITE_SOME_KEY);
	}

	export let data;
	$: ({ countries } = data);
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
<button on:click={signIn}>Sign in</button>

<ul>
	{#each countries as country}
		<li>{country.name}</li>
	{/each}
</ul>
