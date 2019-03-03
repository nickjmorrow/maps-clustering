import { action } from "typesafe-actions";
import { IPointsGroup } from "./types";

export enum dataTypeKeys {
	CREATE_POINTS_GROUP = "CREATE_POINTS_GROUP",
	CREATE_POINTS_GROUP_SUCCEEDED = "CREATE_POINTS_GROUP_SUCCEEDED",
	CREATE_POINTS_GROUP_FAILED = "CREATE_POINTS_GROUP_FAILED",
	ADD_POINTS_GROUP = "ADD_POINTS_GROUP",
	ADD_POINTS_GROUP_SUCCEEDED = "ADD_POINTS_GROUP_SUCCEEDED",
	ADD_POINTS_GROUP_FAILED = "ADD_POINTS_GROUP_FAILED",
	POPULATE_POINTS_GROUPS_STATE_FROM_LOCAL_STORAGE_IF_AVAILABLE = "POPULATE_POINTS_GROUPS_STATE_FROM_LOCAL_STORAGE_IF_AVAILABLE",
	POPULATE_POINTS_GROUPS_STATE_FROM_LOCAL_STORAGE_IF_AVAILABLE_SUCCEEDED = "POPULATE_POINTS_GROUPS_STATE_FROM_LOCAL_STORAGE_IF_AVAILABLE_SUCCEEDED",
	GET_POINTS_GROUPS = "GET_POINTS_GROUPS",
	GET_POINTS_GROUPS_SUCCEEDED = "GET_POINTS_GROUPS_SUCCEEDED",
	GET_POINTS_GROUPS_FAILED = "GET_POINTS_GROUPS_FAILED",
	SAVE_POINTS_GROUP_IF_STORED_LOCALLY = "SAVE_POINTS_GROUP_IF_STORED_LOCALLY",
	SAVE_POINTS_GROUP_IF_STORED_LOCALLY_SUCCEEDED = "SAVE_POINTS_GROUP_IF_STORED_LOCALLY_SUCCEEDED",
	SAVE_POINTS_GROUP_IF_STORED_LOCALLY_FAILED = "SAVE_POINTS_GROUP_IF_STORED_LOCALLY_FAILED",
	DELETE_POINTS_GROUP = "DELETE_POINTS_GROUP",
	DELETE_POINTS_GROUP_SUCCEEDED = "DELETE_POINTS_GROUP_SUCCEEDED",
	DELETE_POINTS_GROUP_FAILED = "DELETE_POINTS_GROUP_FAILED",
	SET_ACTIVE_POINTS_GROUP = "SET_ACTIVE_POINTS_GROUP",
	REMOVE_SAVED_AND_PRIVATE_POINTS_GROUPS = "REMOVE_UNSAVED_POINTS_GROUPS",
	SET_CLUSTER_COUNT = "SET_CLUSTER_COUNT"
}

export const addPointsGroup = {
	request: (payload: FormData) =>
		action(dataTypeKeys.ADD_POINTS_GROUP, payload),
	success: (payload: IPointsGroup) =>
		action(dataTypeKeys.ADD_POINTS_GROUP_SUCCEEDED, payload),
	failure: (payload: string) =>
		action(dataTypeKeys.ADD_POINTS_GROUP_FAILED, payload)
};

export const createPointsGroup = {
	request: (payload: FormData) =>
		action(dataTypeKeys.CREATE_POINTS_GROUP, payload),
	success: (payload: IPointsGroup) =>
		action(dataTypeKeys.CREATE_POINTS_GROUP_SUCCEEDED, payload),
	failure: (payload: string) =>
		action(dataTypeKeys.CREATE_POINTS_GROUP_FAILED, payload)
};

export const savePointsGroupIfStoredLocally = {
	request: () => action(dataTypeKeys.SAVE_POINTS_GROUP_IF_STORED_LOCALLY),
	success: (pointsGroup: IPointsGroup) =>
		action(
			dataTypeKeys.SAVE_POINTS_GROUP_IF_STORED_LOCALLY_SUCCEEDED,
			pointsGroup
		),
	failure: (payload: string) =>
		action(dataTypeKeys.SAVE_POINTS_GROUP_IF_STORED_LOCALLY_FAILED, payload)
};

export const getPointsGroups = {
	request: () => action(dataTypeKeys.GET_POINTS_GROUPS),
	success: (payload: IPointsGroup[]) =>
		action(dataTypeKeys.GET_POINTS_GROUPS_SUCCEEDED, payload),
	failure: (payload: string) =>
		action(dataTypeKeys.GET_POINTS_GROUPS_FAILED, payload)
};

export const deletePointsGroup = {
	request: (payload: number) =>
		action(dataTypeKeys.DELETE_POINTS_GROUP, payload),
	success: (payload: number) =>
		action(dataTypeKeys.DELETE_POINTS_GROUP_SUCCEEDED, payload)
};

export const populatePointsGroupsStateFromLocalStorageIfAvailable = {
	request: () =>
		action(
			dataTypeKeys.POPULATE_POINTS_GROUPS_STATE_FROM_LOCAL_STORAGE_IF_AVAILABLE
		),
	success: (pointsGroups: IPointsGroup) =>
		action(
			dataTypeKeys.POPULATE_POINTS_GROUPS_STATE_FROM_LOCAL_STORAGE_IF_AVAILABLE_SUCCEEDED,
			pointsGroups
		)
};

export const setActivePointsGroup = (payload: number) =>
	action(dataTypeKeys.SET_ACTIVE_POINTS_GROUP, payload);

export const setClusterCount = (payload: {
	pointsGroupId: number | undefined;
	clusterCount: number;
}) => action(dataTypeKeys.SET_CLUSTER_COUNT, payload);

export const onRemoveUnsavedPointsGroups = () =>
	action(dataTypeKeys.REMOVE_SAVED_AND_PRIVATE_POINTS_GROUPS);
