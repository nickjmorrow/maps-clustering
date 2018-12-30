import { action } from 'typesafe-actions';
import { Point, ModeledPoint } from './types';

export enum dataTypeKeys {
	GET_DATA = 'GET_DATA',
	GET_DATA_SUCCEEDED = 'GET_DATA_SUCCEEDED',
	GET_DATA_FAILED = 'GET_DATA_FAILED',
	GET_AGGLOMERATIVE_HIERARCHICAL_CLUSTERS = 'GET_AGGLOMERATIVE_HIERARCHICAL_CLUSTERS',
	GET_AGGLOMERATIVE_HIERARCHICAL_CLUSTERS_SUCCEEDED = 'GET_AGGLOMERATIVE_HIERARCHICAL_CLUSTERS_SUCCEEDED',
	GET_AGGLOMERATIVE_HIERARCHICAL_CLUSTERS_FAILED = 'GET_AGGLOMERATIVE_HIERARCHICAL_CLUSTERS_FAILED'
}

export const getMapData = (payload: FormData): GetMapDataAction =>
	action(dataTypeKeys.GET_DATA, payload);
export const getMapDataSucceeded = (payload: Point[]): GetDataSucceededAction =>
	action(dataTypeKeys.GET_DATA_SUCCEEDED, payload);
export const getMapDataFailed = (payload: string): GetDataFailedAction =>
	action(dataTypeKeys.GET_DATA_FAILED, payload);

export const getAgglomerativeHierarchicalClusters = (
	payload: Point[]
): GetAgglomerativeHierarchicalClustersAction =>
	action(dataTypeKeys.GET_AGGLOMERATIVE_HIERARCHICAL_CLUSTERS, payload);
export const getAgglomerativeHierarchicalClustersSucceeded = (
	payload: ModeledPoint[]
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

export type ActionTypes =
	| GetMapDataAction
	| GetDataSucceededAction
	| GetDataFailedAction
	| GetAgglomerativeHierarchicalClustersAction
	| GetAgglomerativeHierarchicalClustersSucceededAction
	| GetAgglomerativeHierarchicalClustersFailedAction;

export interface GetMapDataAction {
	type: dataTypeKeys.GET_DATA;
	payload: FormData;
}

export interface GetDataSucceededAction {
	type: dataTypeKeys.GET_DATA_SUCCEEDED;
	payload: any; // TODO
}

export interface GetDataFailedAction {
	type: dataTypeKeys.GET_DATA_FAILED;
	payload: string;
}

export interface GetAgglomerativeHierarchicalClustersAction {
	type: dataTypeKeys.GET_AGGLOMERATIVE_HIERARCHICAL_CLUSTERS;
	payload: Point[];
}

export interface GetAgglomerativeHierarchicalClustersSucceededAction {
	type: dataTypeKeys.GET_AGGLOMERATIVE_HIERARCHICAL_CLUSTERS_SUCCEEDED;
	payload: ModeledPoint[];
}

export interface GetAgglomerativeHierarchicalClustersFailedAction {
	type: dataTypeKeys.GET_AGGLOMERATIVE_HIERARCHICAL_CLUSTERS_FAILED;
	payload: string;
}
