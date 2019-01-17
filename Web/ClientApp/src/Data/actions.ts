import { action } from 'typesafe-actions';
import {
	AgglomerativeHierarchicalClusterConfig,
	AgglomerativeHierarchicalClusterPoint as AhcPoint,
	ClusteredPoint,
	DbscanConfig,
	IPointsGroup,
	IPoint,
	IPointsGroupInput
} from './types';

export enum dataTypeKeys {
	CREATE_POINTS_GROUP = 'CREATE_POINTS_GROUP',
	CREATE_POINTS_GROUP_SUCCEEDED = 'GET_DATA_SUCCEEDED',
	GET_DATA_FAILED = 'GET_DATA_FAILED',
	GET_AHCS = 'GET_AGGLOMERATIVE_HIERARCHICAL_CLUSTERS',
	GET_AHCS_SUCCEEDED = 'GET_AGGLOMERATIVE_HIERARCHICAL_CLUSTERS_SUCCEEDED',
	GET_AHCS_FAILED = 'GET_AGGLOMERATIVE_HIERARCHICAL_CLUSTERS_FAILED',
	GET_DBSCAN = 'GET_DBSCAN',
	GET_DBSCAN_SUCCEEDED = 'GET_DBSCAN_SUCCEEDED',
	GET_DBSCAN_FAILED = 'GET_DBSCAN_FAILED',
	POPULATE_POINTS_STATE_FROM_LOCAL_STORAGE_IF_AVAILABLE = 'POPULATE_POINTS_STATE_FROM_LOCAL_STORAGE_IF_AVAILABLE',
	POPULATE_POINTS_STATE_FROM_LOCAL_STORAGE_IF_AVAILABLE_SUCCEEDED = 'POPULATE_POINTS_STATE_FROM_LOCAL_STORAGE_IF_AVAILABLE_SUCCEEDED',
	GET_POINTS_GROUPS = 'GET_POINTS_GROUPS',
	GET_POINTS_GROUPS_SUCCEEDED = 'GET_POINTS_GROUPS_SUCCEEDED',
	SAVE_POINTS_GROUP = 'SAVE_POINTS_GROUP',
	SAVE_POINTS_GROUP_SUCCEEDED = 'SAVE_POINTS_GROUP_SUCCEEDED'
}

export const createPointsGroup = {
	request: (payload: IPointsGroupInput): ICreatePointsGroupAction =>
		action(dataTypeKeys.CREATE_POINTS_GROUP, payload),
	success: (payload: IPointsGroup): ICreatePointsGroupSucceededAction =>
		action(dataTypeKeys.CREATE_POINTS_GROUP_SUCCEEDED, payload)
};

export const getMapDataFailed = (payload: string): GetMapPointsFailedAction =>
	action(dataTypeKeys.GET_DATA_FAILED, payload);

export const getAgglomerativeHierarchicalClusters = (
	payload: IPoint[]
): GetAhcAction => action(dataTypeKeys.GET_AHCS, payload);
export const getAgglomerativeHierarchicalClustersSucceeded = (
	payload: AhcPoint[]
): GetAhcSucceededAction => action(dataTypeKeys.GET_AHCS_SUCCEEDED, payload);
export const getAgglomerativeHierarchicalClustersFailed = (
	payload: string
): GetAgglomerativeHierarchicalClustersFailedAction =>
	action(dataTypeKeys.GET_AHCS_FAILED, payload);

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
	| ICreatePointsGroupAction
	| ICreatePointsGroupSucceededAction
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
	| IGetPointsGroupsActionSucceeded;

export interface ICreatePointsGroupAction {
	type: dataTypeKeys.CREATE_POINTS_GROUP;
	payload: IPointsGroupInput;
}

export interface ICreatePointsGroupSucceededAction {
	type: dataTypeKeys.CREATE_POINTS_GROUP_SUCCEEDED;
	payload: IPointsGroup;
}

export interface GetMapPointsFailedAction {
	type: dataTypeKeys.GET_DATA_FAILED;
	payload: string;
}

export interface GetAhcAction {
	type: dataTypeKeys.GET_AHCS;
	payload: AgglomerativeHierarchicalClusterConfig;
}

export interface GetAhcSucceededAction {
	type: dataTypeKeys.GET_AHCS_SUCCEEDED;
	payload: AhcPoint[];
}

export interface GetAgglomerativeHierarchicalClustersFailedAction {
	type: dataTypeKeys.GET_AHCS_FAILED;
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

export interface ISavePointsGroupAction {
	type: dataTypeKeys.SAVE_POINTS_GROUP;
}

export interface ISavePointsGroupActionSucceeded {
	type: dataTypeKeys.SAVE_POINTS_GROUP_SUCCEEDED;
	payload: IPointsGroup;
}
