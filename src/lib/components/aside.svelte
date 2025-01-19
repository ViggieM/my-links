<script lang="ts">
	import { fly } from 'svelte/transition';
	let { children, content, isOpen = $bindable() } = $props();

	let startX = $state(0);
	let touchX = $state(0);
	let deltaX = $state(0);
	let sidebar: HTMLElement;

	const close = () => (isOpen = false);
	function onkeydown(e: KeyboardEvent) {
		e.stopPropagation();
		if (e.key === 'Escape') {
			close();
		}
	}

	function ontouchstart(evt: TouchEvent) {
		startX = evt.touches[0].clientX;
	}

	function ontouchend() {
		if (sidebar.clientWidth / 3 < deltaX) {
			// close the sidebar
			isOpen = false;
		} else {
			// the sidebar doesn't close
			sidebar.style.translate = `0px`;
		}
		startX = touchX = deltaX = 0;
	}

	function ontouchmove(evt: TouchEvent) {
		touchX = evt.touches[0].clientX;
		deltaX = Math.max(0, touchX - startX);
		sidebar.style.translate = `${deltaX}px`;
	}
</script>

{@render children()}

{#if isOpen}
	<div class="backdrop" onclick={close} role="presentation"></div>
	<aside
		class="sidebar"
		transition:fly={{ x: '100%' }}
		bind:this={sidebar}
		{ontouchstart}
		{ontouchend}
		{ontouchmove}
	>
		{@render content?.()}
	</aside>
{/if}

<svelte:window {onkeydown} />

<style>
	.backdrop {
		@apply fixed left-0 top-0 h-full w-full cursor-pointer bg-[#0006];
	}

	.sidebar {
		@apply fixed right-0 top-0 min-h-full w-[90%] bg-base-200 p-4 transition-transform duration-200 md:w-2/3 xl:w-1/3;
	}
</style>
