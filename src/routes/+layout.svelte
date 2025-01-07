<script lang="ts">
	import '../app.css';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import Navigation from '$lib/components/navigation.svelte';

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
	<div class="drawer-side">
		<label for="sidebar" aria-label="close sidebar" class="drawer-overlay"></label>
		<ul class="menu min-h-full w-full bg-base-200 p-4 text-base-content sm:w-1/2 xl:w-1/3">
			<li>
				<div>
					<p>
						Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequatur dolore illum
						inventore? Dolor ea eaque earum ex fugiat impedit magnam nam nisi, nulla officiis quae
						qui quibusdam, quo ratione voluptatem?
					</p>
				</div>
			</li>
			<li>
				<p>
					Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aliquam amet atque
					consectetur, consequuntur, deleniti eum expedita explicabo hic id, magni natus qui quod
					repellendus reprehenderit sunt totam? A, unde!
				</p>
			</li>
			<li class="p-4">
				<textarea name="" id="" cols="5" rows="10"></textarea>
			</li>
		</ul>
	</div>
</div>
