import { IOption } from 'njm-react-component-library/lib/types';

export const manhattanPosition = { lat: 40.7831, lng: -73.9712 };
export const scale = 6;
export const labeledRoutes = [
	{ path: '/form', label: 'Upload File' },
	{ path: '/map', label: 'View Map' },
	{ path: '/info', label: 'Info' }
];
export const initialOptions: IOption[] = [
	{ value: 'ahc', label: 'AHC' },
	{ value: 'dbscan', label: 'DBSCAN' },
	{ value: 'msc', label: 'Mean-Shift Clustering' },
	{ value: 'kmc', label: 'K-Means Clustering' }
];
