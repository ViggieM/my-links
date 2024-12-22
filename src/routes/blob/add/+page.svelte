<script lang="ts">
	import { enhance } from '$app/forms';
	let { form } = $props();
</script>

<form action="?/create" method="post" class="form-control gap-2" use:enhance>
	<label class="input input-bordered flex items-center gap-2">
		<input type="text" name="title" required class="grow" placeholder="Title" />
	</label>

	<label class="input input-bordered flex items-center gap-2">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			class="h-4 w-4 opacity-70"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
			/>
		</svg>

		<input type="url" name="url" class="grow" placeholder="URL" />
	</label>

	<div class="flex">
		Rating:
		<div class="rating">
			<input type="radio" name="rating" value="" class="rating-hidden" checked />
			<input type="radio" name="rating" value="1" class="mask mask-star-2 bg-orange-400" />
			<input type="radio" name="rating" value="2" class="mask mask-star-2 bg-orange-400" />
			<input type="radio" name="rating" value="3" class="mask mask-star-2 bg-orange-400" />
			<input type="radio" name="rating" value="4" class="mask mask-star-2 bg-orange-400" />
			<input type="radio" name="rating" value="5" class="mask mask-star-2 bg-orange-400" />
		</div>
	</div>

	<label class="form-control">
		<div class="label">
			<span class="label-text">Notes</span>
		</div>
		<textarea class="textarea textarea-bordered h-24" name="notes" placeholder="Notes"></textarea>
	</label>

	<button class="btn btn-primary mt-4">Save</button>
</form>

{#if form?.error}
	<p class="my-2 text-error">{form.error}</p>
{/if}
