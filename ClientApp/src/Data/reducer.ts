import { ActionTypes, dataTypeKeys } from './actions';

export interface DataState {
	readonly points: any[];
	readonly error: string;
}

const initialState: DataState = {
	points: [] as any[],
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
		default:
			return state;
	}
};
