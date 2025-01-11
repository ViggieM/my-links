<script lang="ts">
	import '../app.css';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import Navigation from '$lib/components/baseNavigation.svelte';
	import SideBar from '$lib/components/baseSideBar.svelte';

	let { data, children } = $props();
	let { session, supabase, user } = data;

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
			invalidate('supabase:db:blobs');
		});

		return () => data.subscription.unsubscribe();
	});
</script>

<Navigation {supabase} {user} />

<div class="drawer drawer-end">
	<input id="sidebar" type="checkbox" class="drawer-toggle" />
	<div class="drawer-content">
		<div class="container mx-auto">{@render children()}</div>
	</div>
	<SideBar />
</div>
