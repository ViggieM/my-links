<script>
	/**
	 * @typedef {Object} Props
	 * @property {import('svelte').Snippet} [children]
	 */

	/** @type {Props} */
	let { children } = $props();
</script>

<header>
	<nav>
		<a href="/">Home</a>
	</nav>
</header>

{@render children?.()}
