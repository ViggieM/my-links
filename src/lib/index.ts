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
