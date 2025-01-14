import type { SvelteComponent } from 'svelte';
import type { Bookmark } from '$lib/services/utilities';

type SidebarState = {
	isOpen: boolean;
	displayedComponent: null | SvelteComponent;
	displayedComponentProps: null | { bookmark: Bookmark };
};

export const sidebarState: SidebarState = $state({
	isOpen: false,
	displayedComponent: null,
	displayedComponentProps: null
});

// todo: not so proud about how this is handled
export const createBlobState = $state({
	title: '',
	url: ''
});
