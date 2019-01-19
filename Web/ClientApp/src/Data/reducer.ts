import { ActionTypes, dataTypeKeys } from './actions';
import {
	AgglomerativeHierarchicalClusterPoint,
	ClusteredPoint,
	IPoint,
	IPointsGroup
} from './types';

export interface DataState {
	readonly points: IPoint[];
	readonly error: string;
	readonly agglomerativeHierarchicalClusters: AgglomerativeHierarchicalClusterPoint[];
	readonly dbscan: ClusteredPoint[];
	readonly pointsGroups: IPointsGroup[];
}

const initialState: DataState = {
	points: [],
	agglomerativeHierarchicalClusters: [],
	dbscan: [],
	pointsGroups: [],
	error: ''
};

export const dataReducer = (
	state: DataState,
	action: ActionTypes
): DataState => {
	state = state || initialState;

	switch (action.type) {
		case dataTypeKeys.CREATE_POINTS_GROUP_SUCCEEDED:
			return {
				...state,
				pointsGroups: [
					...getSavedPointsGroups(state).map(pg => ({
						...pg,
						isActive: false
					})),
					{ ...action.payload, isActive: true }
				]
			};
		case dataTypeKeys.GET_POINTS_GROUPS_SUCCEEDED:
			return {
				...state,
				pointsGroups: firstUnsavedOrJustFirst(
					state.pointsGroups,
					action.payload
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
		case dataTypeKeys.POPULATE_POINTS_STATE_FROM_LOCAL_STORAGE_IF_AVAILABLE_SUCCEEDED:
			return { ...state, points: action.payload };
		case dataTypeKeys.POPULATE_POINTS_GROUPS_STATE_FROM_LOCAL_STORAGE_IF_AVAILABLE_SUCCEEDED:
			return {
				...state,
				pointsGroups: [
					...getSavedPointsGroups(state),
					...action.payload.map(withFirstPointsGroupActive)
				]
			};
		case dataTypeKeys.SAVE_POINTS_GROUP_SUCCEEDED:
			return {
				...state,
				pointsGroups: state.pointsGroups.map(pg =>
					pg.pointsGroupId
						? pg
						: {
								...action.payload
						  }
				)
			};
		case dataTypeKeys.DELETE_POINTS_GROUP_SUCCEEDED:
			return {
				...state,
				pointsGroups: state.pointsGroups.filter(
					removePointsGroupId(action.payload)
				)
			};
		case dataTypeKeys.SET_ACTIVE_POINTS_GROUP:
			return {
				...state,
				pointsGroups: state.pointsGroups.map(
					setActivePointsGroup(action.payload)
				)
			};
		default:
			return state;
	}
};

const getSavedPointsGroups = (dataState: DataState): IPointsGroup[] =>
	dataState.pointsGroups.filter(pg => pg.pointsGroupId);

const removePointsGroupId = (pointsGroupId: number) => (
	pointsGroup: IPointsGroup
) => pointsGroup.pointsGroupId !== pointsGroupId;

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
