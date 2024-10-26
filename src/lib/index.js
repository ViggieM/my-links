// place files you want to import through the `$lib` alias in this folder.
export function debounce(func, timeout = 300) {
	let timer;
	return (...args) => {
		clearTimeout(timer);
		timer = setTimeout(() => {
			func.apply(this, args);
		}, timeout);
	};
}

// todo: debounce leading implementieren für click auf tags um nicht zu viele requests zu machen
// https://www.freecodecamp.org/news/javascript-debounce-example/
