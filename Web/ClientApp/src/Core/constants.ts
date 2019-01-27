import { MapPage } from '../Data';
import { apiKey } from '../secrets';

export const googleMapURL = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=3.exp&libraries=geometry,drawing,places`;

export const routes = [
	{
		route: '/map',
		component: MapPage,
		children: 'Map'
	}
];

export const manhattanPosition = { lat: 40.7831, lng: -73.9712 };
export const scale = 6;
