const randomColor = require('randomcolor');

export const isInLocalStorage = (key: string): boolean => localStorage.getItem(key) !== null;

export const getFromLocalStorage = (key: string) => {
	const item = localStorage.getItem(key);
	return item ? JSON.parse(item) : null;
};

export const removeFromLocalStorage = (key: string) => localStorage.removeItem(key);

export const addToLocalStorage = (value: object, key: string) => {
	localStorage.setItem(key, JSON.stringify(value));
};

export const addToLocalStorageIfNotPresent = (value: object, key: string) => {
	if (!isInLocalStorage(key)) {
		addToLocalStorage(value, key);
	}
};

export const getColors = (count: number) =>
	randomColor({
		count,
		opacity: 0.9,
		luminosity: 'dark',
	});
