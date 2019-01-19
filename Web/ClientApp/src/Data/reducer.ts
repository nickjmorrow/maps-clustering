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
			const pointsGroups = [...state.pointsGroups, action.payload];
			return { ...state, pointsGroups };
		case dataTypeKeys.GET_POINTS_GROUPS_SUCCEEDED:
			return { ...state, pointsGroups: action.payload };
		case dataTypeKeys.GET_MAP_POINTS:
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
			const unsavedPointsGroupsFromState = state.pointsGroups.filter(
				pg => !pg.pointsGroupId
			);
			return {
				...state,
				pointsGroups: [
					...unsavedPointsGroupsFromState,
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
