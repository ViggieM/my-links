<script lang="ts">
	import { sidebarState } from '$lib/stores/sidebar.svelte';

	let { supabase } = $props();
	let startX = $state(0);
	let touchX = $state(0);
	let deltaX = $state(0);
	let sidebar: HTMLUListElement;

	function ontouchstart(evt: TouchEvent) {
		startX = evt.touches[0].clientX;
	}

	function ontouchend() {
		if (sidebar.clientWidth / 3 < deltaX) {
			// close the sidebar
			sidebarState.isOpen = false;
			// wait until the sidebar disappears, so it doesn't jump left first, before closing
			setTimeout(() => {
				sidebar.style.translate = `0px`;
			}, 300);
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

<div class="drawer-side">
	<label for="sidebar" aria-label="close sidebar" class="drawer-overlay"></label>
	<ul
		class="min-h-full w-[90%] bg-base-200 p-4 sm:w-1/2 xl:w-1/3"
		{ontouchstart}
		{ontouchend}
		{ontouchmove}
		bind:this={sidebar}
	>
		{#if sidebarState.displayedComponent}
			{@const SidebarContent = sidebarState.displayedComponent}
			<SidebarContent {supabase} />
		{/if}
	</ul>
</div>
