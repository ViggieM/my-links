import { Tag } from '$lib/stores/tags.svelte';
import type { ObjectOption } from 'svelte-multiselect';

export const getAccessibleColor = (r: number, g: number, b: number) => {
	// https://blog.logrocket.com/applying-dynamic-styles-tailwind-css/
	const yiq = (r * 299 + g * 587 + b * 114) / 1000;
	return yiq >= 128 ? '#000000' : '#FFFFFF';
};

export const hexToRGB = (hex: string) => {
	const color = hex.replace(/#/g, '');
	// rgb values
	const r = parseInt(color.substring(0, 2), 16);
	const g = parseInt(color.substring(2, 4), 16);
	const b = parseInt(color.substring(4, 6), 16);

	return [r, g, b];
};

export function rgbToHex(r: number, g: number, b: number) {
	return '#' + [r, g, b].map((value) => value.toString(16).padStart(2, '0')).join('');
}

export function parseBadgeInlineStyle(r: number, g: number, b: number, a: number) {
	return `color: ${getAccessibleColor(r, g, b)};
	        background-color: rgba(${r}, ${g}, ${b}, ${a});`;
}

export function optionFromTag(tag: Tag): ObjectOption {
	const [r, g, b] = hexToRGB(tag.color);
	const level = tag.level || 0;
	const a = Math.max(0.8 - level / 10, 0.3);

	return {
		id: tag.id,
		parent_id: tag.parentId,
		label: tag.name,
		level: level,
		style: {
			option: parseBadgeInlineStyle(r, g, b, a),
			selected: parseBadgeInlineStyle(r, g, b, a)
		}
	};
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function debounce(callback: Function, wait = 300) {
	let timeout: ReturnType<typeof setTimeout>;

	return (...args: any[]) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => callback(...args), wait);
	};
}
