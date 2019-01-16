import { IOption } from 'njm-react-component-library';

export enum fileApi {
	get = '/api/data/get',
	upload = '/api/file/convertfiletopoints'
}

export enum calcApi {
	getAgglomerativeHierarchicalClusters = '/api/calc/getAgglomerativeHierarchicalClusters',
	getExpectationMaximizationClusters = '/api/calc/getExpectationMaximizationClusters',
	getDbscan = '/api/calc/getDBSCANClusters',
	getMeanShiftClusters = '/api/calc/getMeanShiftClusters',
	getKMeansClusters = '/api/calc/getKMeansClusters'
}

const pointController = 'point';
export const pointsApi = {
	getPoints: `/api/${pointController}/getPoints`,
	getPointsGroups: `api/${pointController}/getPointsGroups`
};

export enum clusterTypes {
	none = 'none',
	agglomerativeHierarchicalClusters = 'agglomerativeHierarchicalClusters',
	expectationMaximization = 'expectationMaximization',
	dbscan = 'dbscan',
	meanShift = 'meanShift',
	kMeans = 'kMeans'
}

export const clusterOptions: IOption[] = [
	{
		value: clusterTypes.agglomerativeHierarchicalClusters,
		label: 'AHC'
	},
	{ value: clusterTypes.dbscan, label: 'DBSCAN' },
	{
		value: clusterTypes.meanShift,
		label: 'Mean-Shift Clustering'
	},
	{
		value: clusterTypes.kMeans,
		label: 'K-Means Clustering'
	},
	{
		value: clusterTypes.expectationMaximization,
		label: 'Expectation Maximization'
	}
];

export enum localStorageKeys {
	points = 'points'
}

export const formHeaders = {
	headers: { 'Content-Type': 'multipart/form-data' }
};
