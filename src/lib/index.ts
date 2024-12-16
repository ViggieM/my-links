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
