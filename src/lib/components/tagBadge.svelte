<script lang="ts">
	import { hexToRGB, parseBadgeInlineStyle } from '$lib';

	const { tag } = $props();
	let r, g, b, a;
	[r, g, b] = hexToRGB(tag.color);
	a = Math.max(0.8 - tag.level / 10, 0.3);
	const style = parseBadgeInlineStyle(r, g, b, a);
</script>

<span class="badge shrink-0 select-none" draggable="true" {style}>{tag.name}</span>
