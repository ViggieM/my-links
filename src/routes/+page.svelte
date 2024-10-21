<script>
	export let data;
	export let form;
	$: ({ countries, videos } = data);
</script>

<h1>Links</h1>
<p><a href="/auth">Log in</a></p>

{#if form?.error}
	<p class="error">{form.error}</p>
{/if}

<form action="?/upload" method="post" enctype="multipart/form-data">
	<input type="file" name="file" id="file" />
	<button>Submit</button>
</form>

<ul>
	{#each countries as country}
		<li>{country.name}</li>
	{/each}
</ul>

<ul>
	{#each videos as video}
		<li>
			<video controls width="250px">
				<source src={video.signedUrl} type="video/mp4" />
			</video>
		</li>
	{/each}
</ul>
