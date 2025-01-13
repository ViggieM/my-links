<script module lang="ts">
	import blobDetails from '$lib/components/blobDetails.svelte';
	import { Bookmark } from '$lib/services/utilities.js';

	export const content = $state({
		component: blobDetails,
		props: {}
	});

	export function setSidebar(bookmark: Bookmark) {
		content.component = blobDetails;
		content.props = { bookmark };
	}
</script>

<script lang="ts">
	let { supabase, sidebarIsOpen = $bindable() } = $props();
	let startX = $state(0);
	let touchX = $state(0);
	let deltaX = $state(0);
	let sidebar: HTMLUListElement;
	let label: HTMLLabelElement;
	let editing = $state(false);

	function ontouchstart(evt: TouchEvent) {
		startX = evt.touches[0].clientX;
	}

	function ontouchend() {
		if (sidebar.clientWidth / 3 < deltaX) {
			// close the sidebar
			sidebarIsOpen = false;
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

	$effect(() => {
		// set editing to false when sidebar is being closed
		editing = sidebarIsOpen && false;
	});
</script>

<div class="drawer-side">
	<label for="sidebar" aria-label="close sidebar" class="drawer-overlay" bind:this={label}></label>
	<ul
		class="min-h-full w-[90%] bg-base-200 p-4 sm:w-1/2 xl:w-1/3"
		{ontouchstart}
		{ontouchend}
		{ontouchmove}
		bind:this={sidebar}
	>
		{#if content.props.bookmark}
			{@const Content = content.component}
			<Content props={content.props} bind:editing {supabase} />
		{/if}
	</ul>
</div>
