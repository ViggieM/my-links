<script lang="ts">
	let { data } = $props();
	let { blobs } = $derived(data);
</script>

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
