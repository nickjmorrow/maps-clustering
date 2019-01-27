import { ItemPermissionType, getColors } from 'src/Core';
import { ActionType } from 'typesafe-actions';
import * as actions from './actions';
import { dataTypeKeys } from './actions';
import {
	AgglomerativeHierarchicalClusterPoint,
	ClusteredPoint,
	IPoint,
	IPointsGroup
} from './types';

export interface IDataState {
	readonly points: IPoint[];
	readonly error: string;
	readonly agglomerativeHierarchicalClusters: AgglomerativeHierarchicalClusterPoint[];
	readonly dbscan: ClusteredPoint[];
	readonly pointsGroups: IPointsGroup[];
	readonly clusterCount: number;
}

const initialState: IDataState = {
	points: [],
	agglomerativeHierarchicalClusters: [],
	dbscan: [],
	pointsGroups: [],
	error: '',
	clusterCount: 1
};

// TODO: add tests

export const dataReducer = (
	state: IDataState,
	action: ActionType<typeof actions>
): IDataState => {
	state = state || initialState;

	switch (action.type) {
		case dataTypeKeys.GET_POINTS_GROUPS_SUCCEEDED:
			return {
				...state,
				pointsGroups: ensureActivePointsGroup([
					...state.pointsGroups,
					...action.payload
				]).map(withColors)
			};
		case dataTypeKeys.CREATE_POINTS_GROUP_SUCCEEDED:
			return {
				...state,
				pointsGroups: ensureActivePointsGroup(
					[
						...getSavedPointsGroups(state).map(pg => ({
							...pg,
							isActive: false
						})),
						{
							...action.payload,
							isActive: true
						}
					].map(withColors)
				)
			};
		case dataTypeKeys.CREATE_POINTS_GROUP_FAILED:
			return { ...state, error: action.payload };
		case dataTypeKeys.ADD_POINTS_GROUP_SUCCEEDED:
			return {
				...state,
				pointsGroups: [
					...state.pointsGroups,
					{ ...action.payload, isActive: true }
				].map(withColors)
			};

		case dataTypeKeys.POPULATE_POINTS_GROUPS_STATE_FROM_LOCAL_STORAGE_IF_AVAILABLE_SUCCEEDED:
			return {
				...state,
				pointsGroups: ensureActivePointsGroup([
					...getSavedPointsGroups(state),
					...action.payload.map(withFirstPointsGroupActive)
				]).map(withColors)
			};
		case dataTypeKeys.SAVE_POINTS_GROUP_SUCCEEDED:
			return {
				...state,
				pointsGroups: ensureActivePointsGroup(
					state.pointsGroups
						.map(pg =>
							pg.pointsGroupId
								? pg
								: {
										...action.payload
								  }
						)
						.map(withColors)
				)
			};
		case dataTypeKeys.DELETE_POINTS_GROUP_SUCCEEDED:
			return {
				...state,
				pointsGroups: ensureActivePointsGroup(
					state.pointsGroups.filter(
						pg => pg.pointsGroupId !== action.payload
					)
				)
			};
		case dataTypeKeys.SET_ACTIVE_POINTS_GROUP:
			const newPointsGroups = state.pointsGroups.map(
				setActivePointsGroup(action.payload)
			);
			const activePointsGroup = newPointsGroups.find(pg => pg.isActive)!;
			return {
				...state,
				pointsGroups: newPointsGroups,
				clusterCount: Math.min(
					activePointsGroup.ahcInfo.ahcPoints.length,
					state.clusterCount
				)
			};
		case dataTypeKeys.REMOVE_SAVED_AND_PRIVATE_POINTS_GROUPS:
			return {
				...state,
				pointsGroups: state.pointsGroups
					.filter(
						pg =>
							!pg.pointsGroupId ||
							pg.itemPermissionType === ItemPermissionType.Public
					)
					.map(withFirstPointsGroupActive)
			};
		case dataTypeKeys.SET_CLUSTER_COUNT:
			return {
				...state,
				clusterCount: action.payload
			};
		default:
			return state;
	}
};

const getSavedPointsGroups = (dataState: IDataState): IPointsGroup[] =>
	dataState.pointsGroups.filter(pg => pg.pointsGroupId);

const setActivePointsGroup = (pointsGroupId: number | undefined) => (
	pg: IPointsGroup
) =>
	pg.pointsGroupId === pointsGroupId
		? { ...pg, isActive: true }
		: { ...pg, isActive: false };

const withFirstPointsGroupActive = (
	pg: IPointsGroup,
	i: number
): IPointsGroup =>
	i === 0 ? { ...pg, isActive: true } : { ...pg, isActive: false };

const ensureActivePointsGroup = (pointsGroups: IPointsGroup[]) => {
	const hasActivePointsGroup =
		pointsGroups.filter(pg => pg.isActive).length > 0;
	const pointsGroupsWithActive = hasActivePointsGroup
		? pointsGroups.sort(defaultsAreLast).sort(unsavedIsFirst)
		: pointsGroups
				.sort(defaultsAreLast)
				.sort(unsavedIsFirst)
				.map(withFirstPointsGroupActive);
	return pointsGroupsWithActive;
};

const defaultsAreLast = (pg: IPointsGroup) =>
	pg.itemPermissionType === ItemPermissionType.Private ? -1 : 1;

const unsavedIsFirst = (pg: IPointsGroup) => (pg.pointsGroupId ? 1 : -1);

const withColors = (pg: IPointsGroup): IPointsGroup => ({
	...pg,
	pointsColors: pg.pointsColors || getColors(pg.points.length)
});
