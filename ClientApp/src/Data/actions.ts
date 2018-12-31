import { action } from 'typesafe-actions';
import {
	Point,
	AgglomerativeHierarchicalClusterPoint,
	AgglomerativeHierarchicalClusterConfig,
	DbscanConfig,
	ClusteredPoint
} from './types';

export enum dataTypeKeys {
	GET_DATA = 'GET_DATA',
	GET_DATA_SUCCEEDED = 'GET_DATA_SUCCEEDED',
	GET_DATA_FAILED = 'GET_DATA_FAILED',
	GET_AGGLOMERATIVE_HIERARCHICAL_CLUSTERS = 'GET_AGGLOMERATIVE_HIERARCHICAL_CLUSTERS',
	GET_AGGLOMERATIVE_HIERARCHICAL_CLUSTERS_SUCCEEDED = 'GET_AGGLOMERATIVE_HIERARCHICAL_CLUSTERS_SUCCEEDED',
	GET_AGGLOMERATIVE_HIERARCHICAL_CLUSTERS_FAILED = 'GET_AGGLOMERATIVE_HIERARCHICAL_CLUSTERS_FAILED',
	GET_DBSCAN = 'GET_DBSCAN',
	GET_DBSCAN_SUCCEEDED = 'GET_DBSCAN_SUCCEEDED',
	GET_DBSCAN_FAILED = 'GET_DBSCAN_FAILED'
}

export const getMapData = (payload: FormData): GetMapPointsAction =>
	action(dataTypeKeys.GET_DATA, payload);
export const getMapDataSucceeded = (
	payload: Point[]
): GetMapPointsSucceededAction =>
	action(dataTypeKeys.GET_DATA_SUCCEEDED, payload);
export const getMapDataFailed = (payload: string): GetMapPointsFailedAction =>
	action(dataTypeKeys.GET_DATA_FAILED, payload);

export const getAgglomerativeHierarchicalClusters = (
	payload: Point[]
): GetAgglomerativeHierarchicalClustersAction =>
	action(dataTypeKeys.GET_AGGLOMERATIVE_HIERARCHICAL_CLUSTERS, payload);
export const getAgglomerativeHierarchicalClustersSucceeded = (
	payload: AgglomerativeHierarchicalClusterPoint[]
): GetAgglomerativeHierarchicalClustersSucceededAction =>
	action(
		dataTypeKeys.GET_AGGLOMERATIVE_HIERARCHICAL_CLUSTERS_SUCCEEDED,
		payload
	);
export const getAgglomerativeHierarchicalClustersFailed = (
	payload: string
): GetAgglomerativeHierarchicalClustersFailedAction =>
	action(
		dataTypeKeys.GET_AGGLOMERATIVE_HIERARCHICAL_CLUSTERS_FAILED,
		payload
	);

export const getDbscan = {
	request: (payload: DbscanConfig): GetDbscanAction =>
		action(dataTypeKeys.GET_DBSCAN, payload),
	success: (payload: ClusteredPoint[]): GetDbscanSucceededAction =>
		action(dataTypeKeys.GET_DBSCAN_SUCCEEDED, payload),
	failure: (payload: string): GetDbscanFailedAction =>
		action(dataTypeKeys.GET_DBSCAN_FAILED, payload)
};

export type ActionTypes =
	| GetMapPointsAction
	| GetMapPointsSucceededAction
	| GetMapPointsFailedAction
	| GetAgglomerativeHierarchicalClustersAction
	| GetAgglomerativeHierarchicalClustersSucceededAction
	| GetAgglomerativeHierarchicalClustersFailedAction
	| GetDbscanAction
	| GetDbscanSucceededAction
	| GetDbscanFailedAction;

export interface GetMapPointsAction {
	type: dataTypeKeys.GET_DATA;
	payload: FormData;
}

export interface GetMapPointsSucceededAction {
	type: dataTypeKeys.GET_DATA_SUCCEEDED;
	payload: any; // TODO
}

export interface GetMapPointsFailedAction {
	type: dataTypeKeys.GET_DATA_FAILED;
	payload: string;
}

export interface GetAgglomerativeHierarchicalClustersAction {
	type: dataTypeKeys.GET_AGGLOMERATIVE_HIERARCHICAL_CLUSTERS;
	payload: AgglomerativeHierarchicalClusterConfig;
}

export interface GetAgglomerativeHierarchicalClustersSucceededAction {
	type: dataTypeKeys.GET_AGGLOMERATIVE_HIERARCHICAL_CLUSTERS_SUCCEEDED;
	payload: AgglomerativeHierarchicalClusterPoint[];
}

export interface GetAgglomerativeHierarchicalClustersFailedAction {
	type: dataTypeKeys.GET_AGGLOMERATIVE_HIERARCHICAL_CLUSTERS_FAILED;
	payload: string;
}

export interface GetDbscanAction {
	type: dataTypeKeys.GET_DBSCAN;
	payload: DbscanConfig;
}

export interface GetDbscanSucceededAction {
	type: dataTypeKeys.GET_DBSCAN_SUCCEEDED;
	payload: ClusteredPoint[];
}

export interface GetDbscanFailedAction {
	type: dataTypeKeys.GET_DBSCAN_FAILED;
	payload: string;
}
