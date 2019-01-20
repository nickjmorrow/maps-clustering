import { ActionTypes, authTypeKeys } from './actions';
import { IUser } from './types';

export interface IAuthState {
	readonly authenticationInfo: IUser | null;
	readonly error: string | null;
}

const initialState: IAuthState = {
	authenticationInfo: null,
	error: null
};

export const authReducer = (
	state: IAuthState,
	action: ActionTypes
): IAuthState => {
	state = state || initialState;

	switch (action.type) {
		case authTypeKeys.LOGIN_SUCCEEDED:
			return {
				...state,
				authenticationInfo: action.payload,
				error: null
			};
		case authTypeKeys.LOGIN_FAILED:
			return {
				...state,
				error: action.payload
			};
		case authTypeKeys.REGISTER_SUCCEEDED:
			return {
				...state,
				authenticationInfo: action.payload,
				error: null
			};
		case authTypeKeys.REGISTER_FAILED:
			return {
				...state,
				error: action.payload
			};
		case authTypeKeys.LOGOUT_SUCCEEDED:
			return {
				...state,
				authenticationInfo: null,
				error: null
			};
		case authTypeKeys.LOGOUT_FAILED:
			return {
				...state,
				error: action.payload
			};
		case authTypeKeys.POPULATE_USER_STATE_FROM_LOCAL_STORAGE_IF_AVAILABLE_SUCCEEDED: {
			return {
				...state,
				authenticationInfo: action.payload,
				error: null
			};
		}
		case authTypeKeys.POPULATE_USER_STATE_FROM_LOCAL_STORAGE_IF_AVAILABLE_FAILED: {
			return {
				...state,
				error: action.payload
			};
		}
		default:
			return state;
	}
};
