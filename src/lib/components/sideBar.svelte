<script lang="ts">
	let startX = $state(0);
	let touchX = $state(0);
	let deltaX = $state(0);
	let sidebar: HTMLUListElement;
	let label: HTMLLabelElement;

	function ontouchstart(evt: TouchEvent) {
		startX = evt.touches[0].clientX;
	}

	function ontouchend() {
		if (sidebar.clientWidth / 3 < deltaX) {
			// closes the sidebar
			label.click();
			// wait until the sidebar disappears, so it doesn't jump left first, before closing
			setTimeout(() => {
				sidebar.style.translate = `0px`;
			}, 300);
		} else {
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
	<label for="sidebar" aria-label="close sidebar" class="drawer-overlay" bind:this={label}></label>
	<ul
		class="menu min-h-full w-full bg-base-200 p-4 text-base-content sm:w-1/2 xl:w-1/3"
		{ontouchstart}
		{ontouchend}
		{ontouchmove}
		bind:this={sidebar}
	>
		<li>
			<div>
				<p>
					Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequatur dolore illum
					inventore? Dolor ea eaque earum ex fugiat impedit magnam nam nisi, nulla officiis quae qui
					quibusdam, quo ratione voluptatem?
				</p>
			</div>
		</li>
		<li>
			<p>
				Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aliquam amet atque consectetur,
				consequuntur, deleniti eum expedita explicabo hic id, magni natus qui quod repellendus
				reprehenderit sunt totam? A, unde!
			</p>
		</li>
		<li class="p-4">
			<textarea name="" id="" cols="5" rows="10"></textarea>
		</li>
	</ul>
</div>
