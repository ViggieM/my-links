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

function rgbToHsl(r: number, g: number, b: number) {
	r /= 255;
	g /= 255;
	b /= 255;

	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	const delta = max - min;

	let h,
		s,
		l = (max + min) / 2;

	if (delta === 0) {
		h = 0; // No hue
		s = 0; // No saturation
	} else {
		s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);

		switch (max) {
			case r:
				h = (g - b) / delta + (g < b ? 6 : 0);
				break;
			case g:
				h = (b - r) / delta + 2;
				break;
			case b:
				h = (r - g) / delta + 4;
				break;
		}

		h /= 6;
	}

	return [h * 360, s, l]; // Hue in degrees, Saturation and Lightness as 0–1
}

function hslToRgb(h: number, s: number, l: number) {
	const c = (1 - Math.abs(2 * l - 1)) * s;
	const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
	const m = l - c / 2;

	let r, g, b;

	if (h < 60) {
		[r, g, b] = [c, x, 0];
	} else if (h < 120) {
		[r, g, b] = [x, c, 0];
	} else if (h < 180) {
		[r, g, b] = [0, c, x];
	} else if (h < 240) {
		[r, g, b] = [0, x, c];
	} else if (h < 300) {
		[r, g, b] = [x, 0, c];
	} else {
		[r, g, b] = [c, 0, x];
	}

	r = Math.round((r + m) * 255);
	g = Math.round((g + m) * 255);
	b = Math.round((b + m) * 255);

	return [r, g, b];
}

export function analogousGradient(r: number, g: number, b: number, angle = 2) {
	// Convert RGB to HSL
	const [h, s, l]: number[] = rgbToHsl(r, g, b);

	// Calculate analogous hues
	const hue1 = (h + angle) % 360; // Add angle for one analogous color
	const hue2 = (h - angle + 360) % 360; // Subtract angle for another (keep positive)

	// Convert back to RGB
	const color1 = hslToRgb(hue1, s, l);
	const color2 = hslToRgb(hue2, s, l);

	return { startColor: [r, g, b], endColor1: color1, endColor2: color2 };
}
