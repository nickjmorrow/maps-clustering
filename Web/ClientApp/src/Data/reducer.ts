import { ActionTypes, dataTypeKeys } from './actions';
import {
	AgglomerativeHierarchicalClusterPoint,
	ClusteredPoint,
	IPoint,
	IPointsGroup
} from './types';
import { ItemPermissionType } from 'src/Core';

export interface IDataState {
	readonly points: IPoint[];
	readonly error: string;
	readonly agglomerativeHierarchicalClusters: AgglomerativeHierarchicalClusterPoint[];
	readonly dbscan: ClusteredPoint[];
	readonly pointsGroups: IPointsGroup[];
}

const initialState: IDataState = {
	points: [],
	agglomerativeHierarchicalClusters: [],
	dbscan: [],
	pointsGroups: [],
	error: ''
};

// TODO: add tests
export const dataReducer = (
	state: IDataState,
	action: ActionTypes
): IDataState => {
	state = state || initialState;

	switch (action.type) {
		case dataTypeKeys.CREATE_POINTS_GROUP_SUCCEEDED:
			return {
				...state,
				pointsGroups: ensureActivePointsGroup([
					...getSavedPointsGroups(state).map(pg => ({
						...pg,
						isActive: false
					})),
					{ ...action.payload, isActive: true }
				])
			};
		case dataTypeKeys.GET_POINTS_GROUPS_SUCCEEDED:
			return {
				...state,
				pointsGroups: ensureActivePointsGroup(
					firstUnsavedOrJustFirst(state.pointsGroups, action.payload)
				)
			};
		case dataTypeKeys.CREATE_POINTS_GROUP_FAILED:
			return { ...state, error: action.payload };
		case dataTypeKeys.GET_AHCS_SUCCEEDED:
			const { pointsGroupId } = action.payload;
			return {
				...state,
				pointsGroups: state.pointsGroups.map(pg =>
					pg.pointsGroupId === pointsGroupId ? action.payload : pg
				)
			};
		case dataTypeKeys.GET_AHCS_FAILED:
			return { ...state, error: action.payload };
		case dataTypeKeys.POPULATE_POINTS_GROUPS_STATE_FROM_LOCAL_STORAGE_IF_AVAILABLE_SUCCEEDED:
			return {
				...state,
				pointsGroups: ensureActivePointsGroup([
					...getSavedPointsGroups(state),
					...action.payload.map(withFirstPointsGroupActive)
				])
			};
		case dataTypeKeys.SAVE_POINTS_GROUP_SUCCEEDED:
			const newPointsGroups = state.pointsGroups.map(pg =>
				pg.pointsGroupId
					? pg
					: {
							...action.payload
					  }
			);
			return {
				...state,
				pointsGroups: ensureActivePointsGroup(newPointsGroups)
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
			return {
				...state,
				pointsGroups: state.pointsGroups.map(
					setActivePointsGroup(action.payload)
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

const firstUnsavedOrJustFirst = (
	pointsGroups: IPointsGroup[],
	savedPointsGroups: IPointsGroup[]
) => {
	const unsavedPointsGroupsAndSavedPointsGroups = [
		...getUnsavedPointsGroups(pointsGroups),
		...savedPointsGroups
	];
	return unsavedPointsGroupsAndSavedPointsGroups.map(
		withFirstPointsGroupActive
	);
};

const withFirstPointsGroupActive = (
	pg: IPointsGroup,
	i: number
): IPointsGroup =>
	i === 0 ? { ...pg, isActive: true } : { ...pg, isActive: false };

const getUnsavedPointsGroups = (pointsGroup: IPointsGroup[]) =>
	pointsGroup.filter(pg => !pg.pointsGroupId);

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
