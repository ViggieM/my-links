<script lang="ts">
	const { blob } = $props();

	function truncate(source: string, size: number) {
		return source.length > size ? source.slice(0, size - 1) + '…' : source;
	}
</script>

{#if blob.url}
	<a
		href={blob.url}
		class="link link-primary flex items-center gap-2 overflow-hidden"
		title={blob.url}
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			class="h-6 w-6"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
			/>
		</svg>

		{truncate(blob.url, 100)}
	</a>
{/if}
