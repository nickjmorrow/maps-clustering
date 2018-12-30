export enum fileApi {
	get = '/api/data/get',
	upload = '/api/file/convertfiletopoints'
}

export enum calcApi {
	getAgglomerativeHierarchicalClusters = '/api/calc/getAgglomerativeHierarchicalClusters'
}

export enum localStorageKeys {
	points = 'points'
}

export const formHeaders = {
	headers: { 'Content-Type': 'multipart/form-data' }
};

export enum clusterTypes {
	none = 'none',
	agglomerativeHierarchicalClusters = 'agglomerativeHierarchicalClusters',
	expectationMaximization = 'expectationMaximization',
	dbscan = 'dbscan',
	meanShift = 'meanShift',
	kMeans = 'kMeans'
}
