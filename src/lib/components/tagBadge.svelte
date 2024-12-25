<script lang="ts">
	import { getTagColor, parseBadgeInlineStyle, tags } from '$lib/stores/tags.svelte';
	import { hexToRGB } from '$lib';

	const { id } = $props();
	const tag = tags.get(id);
	const tagColor = getTagColor(tag);
	let r,
		g,
		b,
		a,
		style = '';
	if (tagColor) {
		[r, g, b] = hexToRGB(tagColor);
		const level = tag.level || 0;
		a = Math.max(0.8 - level / 10, 0.3);
		style = parseBadgeInlineStyle(r, g, b, a);
	}
</script>

<span class="badge shrink-0 select-none" draggable="true" {style}>{tag.name}</span>
