// place files you want to import through the `$lib` alias in this folder.
export function createUniqueColorGenerator(): () => [number, number, number] {
	const usedColors = new Set<string>();

	function getRandomColor(): [number, number, number] {
		let r: number, g: number, b: number, colorKey: string;

		do {
			r = Math.floor(Math.random() * 256);
			g = Math.floor(Math.random() * 256);
			b = Math.floor(Math.random() * 256);
			colorKey = `${r},${g},${b}`; // Create a unique key for the RGB triplet
		} while (usedColors.has(colorKey));

		usedColors.add(colorKey);
		return [r, g, b];
	}

	return getRandomColor;
}

// https://blog.logrocket.com/applying-dynamic-styles-tailwind-css/
export const getAccessibleColor = (r: number, g: number, b: number) => {
	const yiq = (r * 299 + g * 587 + b * 114) / 1000;
	return yiq >= 128 ? '#000000' : '#FFFFFF';
};

export const getRGBColor = (hex: string) => {
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

export function getRandomColor(): string {
	const r = Math.floor(Math.random() * 256);
	const g = Math.floor(Math.random() * 256);
	const b = Math.floor(Math.random() * 256);

	return rgbToHex(r, g, b);
}
