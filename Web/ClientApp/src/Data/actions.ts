import { action } from 'typesafe-actions';
import {
	AgglomerativeHierarchicalClusterConfig,
	AgglomerativeHierarchicalClusterPoint as AhcPoint,
	ClusteredPoint,
	DbscanConfig,
	IPointsGroup,
	IPoint
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
	GET_DBSCAN_FAILED = 'GET_DBSCAN_FAILED',
	POPULATE_POINTS_STATE_FROM_LOCAL_STORAGE_IF_AVAILABLE = 'POPULATE_POINTS_STATE_FROM_LOCAL_STORAGE_IF_AVAILABLE',
	POPULATE_POINTS_STATE_FROM_LOCAL_STORAGE_IF_AVAILABLE_SUCCEEDED = 'POPULATE_POINTS_STATE_FROM_LOCAL_STORAGE_IF_AVAILABLE_SUCCEEDED',
	GET_POINTS_GROUPS = 'GET_POINTS_GROUPS',
	GET_POINTS_GROUPS_SUCCEEDED = 'GET_POINTS_GROUPS_SUCCEEDED',
	CREATE_POINTS_GROUP = 'CREATE_POINTS_GROUP'
}

export const getMapData = (payload: FormData): GetMapPointsAction =>
	action(dataTypeKeys.GET_DATA, payload);
export const getMapDataSucceeded = (
	payload: IPoint[]
): GetMapPointsSucceededAction =>
	action(dataTypeKeys.GET_DATA_SUCCEEDED, payload);
export const getMapDataFailed = (payload: string): GetMapPointsFailedAction =>
	action(dataTypeKeys.GET_DATA_FAILED, payload);

export const getAgglomerativeHierarchicalClusters = (
	payload: IPoint[]
): GetAhcAction =>
	action(dataTypeKeys.GET_AGGLOMERATIVE_HIERARCHICAL_CLUSTERS, payload);
export const getAgglomerativeHierarchicalClustersSucceeded = (
	payload: AhcPoint[]
): GetAhcSucceededAction =>
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

export const getPointsGroups = {
	request: (): IGetPointsGroupsAction =>
		action(dataTypeKeys.GET_POINTS_GROUPS),
	success: (payload: IPointsGroup[]): IGetPointsGroupsActionSucceeded =>
		action(dataTypeKeys.GET_POINTS_GROUPS_SUCCEEDED, payload)
};

export const populatePointsStateFromLocalStorageIfAvailable = () =>
	action(dataTypeKeys.POPULATE_POINTS_STATE_FROM_LOCAL_STORAGE_IF_AVAILABLE);

export type ActionTypes =
	| GetMapPointsAction
	| GetMapPointsSucceededAction
	| GetMapPointsFailedAction
	| GetAhcAction
	| GetAhcSucceededAction
	| GetAgglomerativeHierarchicalClustersFailedAction
	| GetDbscanAction
	| GetDbscanSucceededAction
	| GetDbscanFailedAction
	| IPopulatePointsStateFromLocalStorageIfAvailable
	| IPopulatePointsStateFromLocalStorageIfAvailableSucceeded
	| IGetPointsGroupsAction
	| IGetPointsGroupsActionSucceeded
	| ICreatePointsGroupAction;

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

export interface GetAhcAction {
	type: dataTypeKeys.GET_AGGLOMERATIVE_HIERARCHICAL_CLUSTERS;
	payload: AgglomerativeHierarchicalClusterConfig;
}

export interface GetAhcSucceededAction {
	type: dataTypeKeys.GET_AGGLOMERATIVE_HIERARCHICAL_CLUSTERS_SUCCEEDED;
	payload: AhcPoint[];
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

export interface IPopulatePointsStateFromLocalStorageIfAvailable {
	type: dataTypeKeys.POPULATE_POINTS_STATE_FROM_LOCAL_STORAGE_IF_AVAILABLE;
}

export interface IPopulatePointsStateFromLocalStorageIfAvailableSucceeded {
	type: dataTypeKeys.POPULATE_POINTS_STATE_FROM_LOCAL_STORAGE_IF_AVAILABLE_SUCCEEDED;
	payload: IPoint[];
}

export interface IGetPointsGroupsAction {
	type: dataTypeKeys.GET_POINTS_GROUPS;
}

export interface IGetPointsGroupsActionSucceeded {
	type: dataTypeKeys.GET_POINTS_GROUPS_SUCCEEDED;
	payload: IPointsGroup[];
}

export interface ICreatePointsGroupAction {
	type: dataTypeKeys.CREATE_POINTS_GROUP;
	payload: IPointsGroup;
}
