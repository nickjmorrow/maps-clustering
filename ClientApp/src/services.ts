import { apiKey } from 'src/secrets';
const randomColor = require('randomcolor');

export const googleMapURL = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=3.exp&libraries=geometry,drawing,places`;

export const getRange = (start: number, end: number) => {
	return Array(end - start + 1)
		.fill(0)
		.map((_, idx) => start + idx);
};

export const getColors = (count: number) =>
	randomColor({
		count,
		opacity: 0.9,
		luminosity: 'dark'
	});
