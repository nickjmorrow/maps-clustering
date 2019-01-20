import { Reducer } from 'redux';
import { ActionType } from 'typesafe-actions';
import * as actions from './actions';
import { authTypeKeys } from './actions';

const initialState: IAuthState = {
	authenticationInfo: null,
	error: null
};

export interface IUser {
	name: string;
	email: string;
	password: string;
	userId: number;
	token: string;
}

export interface IAuthState {
	readonly authenticationInfo: IUser | null;
	readonly error: string | null;
}

type AuthAction = ActionType<typeof actions>;

export const authReducer: Reducer<IAuthState, AuthAction> = (state, action) => {
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
