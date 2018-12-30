import { ActionTypes } from './actions';

export interface DataState {
	readonly data: any[];
}

const initialState: DataState = {
	data: [] as any[]
};

export const dataReducer = (
	state: DataState,
	action: ActionTypes
): DataState => {
	state = state || initialState;

	switch (action.type) {
		default:
			return state;
	}
};
