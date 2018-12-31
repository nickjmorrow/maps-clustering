import { ActionTypes, dataTypeKeys } from './actions';
import {
	Point,
	AgglomerativeHierarchicalClusterPoint,
	ClusteredPoint
} from './types';

export interface DataState {
	readonly points: Point[];
	readonly error: string;
	readonly agglomerativeHierarchicalClusters: AgglomerativeHierarchicalClusterPoint[];
	readonly dbscan: ClusteredPoint[];
}

const initialState: DataState = {
	points: [],
	agglomerativeHierarchicalClusters: [],
	dbscan: [],
	error: ''
};

export const dataReducer = (
	state: DataState,
	action: ActionTypes
): DataState => {
	state = state || initialState;

	switch (action.type) {
		case dataTypeKeys.GET_DATA_SUCCEEDED:
			return { ...state, points: action.payload };
		case dataTypeKeys.GET_DATA_FAILED:
			return { ...state, error: action.payload };
		case dataTypeKeys.GET_AGGLOMERATIVE_HIERARCHICAL_CLUSTERS_SUCCEEDED:
			return {
				...state,
				agglomerativeHierarchicalClusters: action.payload
			};
		case dataTypeKeys.GET_AGGLOMERATIVE_HIERARCHICAL_CLUSTERS_FAILED:
			return { ...state, error: action.payload };
		case dataTypeKeys.GET_DBSCAN_SUCCEEDED:
			return { ...state, dbscan: action.payload };
		case dataTypeKeys.GET_DBSCAN_FAILED:
			return { ...state, error: action.payload };
		default:
			return state;
	}
};
