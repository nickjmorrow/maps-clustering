import { IOption } from '@nickjmorrow/react-component-library';
import { apiKey } from '../secrets';

// export enum fileApi {
// 	get = '/api/data/get',
// 	upload = '/api/file/convertfiletopoints'
// }

// export enum calcApi {
// 	getAgglomerativeHierarchicalClusters = '/api/calc/getAgglomerativeHierarchicalClusters',
// 	getExpectationMaximizationClusters = '/api/calc/getExpectationMaximizationClusters',
// 	getDbscan = '/api/calc/getDBSCANClusters',
// 	getMeanShiftClusters = '/api/calc/getMeanShiftClusters',
// 	getKMeansClusters = '/api/calc/getKMeansClusters'
// }

const pointsGroupController = 'pointsGroup';
export const pointsGroupApi = {
	getPointsGroups: `/api/${pointsGroupController}/getPointsGroups`,
	addPointsGroup: `/api/${pointsGroupController}/addPointsGroup`,
	createPointsGroup: `/api/${pointsGroupController}/createPointsGroup`,
	savePointsGroup: `/api/${pointsGroupController}/savePointsGroup`,
	deletePointsGroup: (pointsGroupId: number) =>
		`/api/${pointsGroupController}/deletePointsGroup/${pointsGroupId}`
};

export enum clusterTypes {
	none = 'none',
	ahcs = 'agglomerativeHierarchicalClusters',
	expectationMaximization = 'expectationMaximization',
	dbscan = 'dbscan',
	meanShift = 'meanShift',
	kMeans = 'kMeans'
}

export const clusterOptions: IOption[] = [
	{
		value: clusterTypes.none,
		label: 'None'
	},
	{
		value: clusterTypes.ahcs,
		label: 'AHC'
	}
	// { value: clusterTypes.dbscan, label: 'DBSCAN' },
	// {
	// 	value: clusterTypes.meanShift,
	// 	label: 'Mean-Shift Clustering'
	// },
	// {
	// 	value: clusterTypes.kMeans,
	// 	label: 'K-Means Clustering'
	// },
	// {
	// 	value: clusterTypes.expectationMaximization,
	// 	label: 'Expectation Maximization'
	// }
];

export enum localStorageKeys {
	points = 'points',
	pointsGroup = 'POINTS_GROUPS'
}

export const formHeaders = {
	headers: { 'Content-Type': 'multipart/form-data' }
};

export enum mapFormFields {
	file = 'FILE',
	mapName = 'MAP_NAME'
}

export const googleMapURL = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=3.exp&libraries=geometry,drawing,places`;
