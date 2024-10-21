<script>
	export let data;
	$: ({ countries } = data);
</script>

<h1>Links</h1>
<p><a href="/auth">Log in</a></p>

<ul>
	{#each countries as country}
		<li>{country.name}</li>
	{/each}
</ul>
