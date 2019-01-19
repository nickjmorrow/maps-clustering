import { ActionTypes, dataTypeKeys } from './actions';
import {
	IPoint,
	AgglomerativeHierarchicalClusterPoint,
	ClusteredPoint,
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
				pointsGroups: [...getSavedPointsGroups(state), action.payload]
			};
		case dataTypeKeys.GET_POINTS_GROUPS_SUCCEEDED:
			return {
				...state,
				pointsGroups: [
					...getUnsavedPointsGroups(state),
					...action.payload
				]
			};
		case dataTypeKeys.CREATE_POINTS_GROUP_FAILED:
			return { ...state, error: action.payload };
		case dataTypeKeys.GET_AHCS_SUCCEEDED:
			return {
				...state,
				agglomerativeHierarchicalClusters: action.payload
			};
		case dataTypeKeys.GET_AHCS_FAILED:
			return { ...state, error: action.payload };
		case dataTypeKeys.GET_DBSCAN_SUCCEEDED:
			return { ...state, dbscan: action.payload };
		case dataTypeKeys.GET_DBSCAN_FAILED:
			return { ...state, error: action.payload };
		case dataTypeKeys.POPULATE_POINTS_STATE_FROM_LOCAL_STORAGE_IF_AVAILABLE_SUCCEEDED:
			return { ...state, points: action.payload };
		case dataTypeKeys.POPULATE_POINTS_GROUPS_STATE_FROM_LOCAL_STORAGE_IF_AVAILABLE_SUCCEEDED:
			return {
				...state,
				pointsGroups: [
					...getSavedPointsGroups(state),
					...action.payload
				]
			};
		case dataTypeKeys.SAVE_POINTS_GROUP_SUCCEEDED:
			return {
				...state,
				pointsGroups: state.pointsGroups.map(pg =>
					pg.pointsGroupId
						? pg
						: {
								...pg,
								pointsGroupId: action.payload
						  }
				)
			};
		default:
			return state;
	}
};

const getSavedPointsGroups = (dataState: DataState): IPointsGroup[] =>
	dataState.pointsGroups.filter(pg => pg.pointsGroupId);

const getUnsavedPointsGroups = (dataState: DataState) =>
	dataState.pointsGroups.filter(pg => !pg.pointsGroupId);
