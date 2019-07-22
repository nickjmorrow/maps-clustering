import { User } from "./types";
import { typeKeys } from "./typeKeys";
import { ActionType } from "typesafe-actions";
import * as actions from "./actions";

export interface AuthState {
	readonly authenticationInfo: User | null;
	readonly error: string | null;
}

const initialState: AuthState = {
	authenticationInfo: null,
	error: null
};

export const authReducer = (
	state: AuthState,
	action: ActionType<typeof actions>
): AuthState => {
	state = state || initialState;

	switch (action.type) {
		case typeKeys.LOGIN_SUCCEEDED:
			return {
				...state,
				authenticationInfo: action.payload,
				error: null
			};
		case typeKeys.LOGIN_FAILED:
			return {
				...state,
				error: action.payload
			};
		case typeKeys.REGISTER_SUCCEEDED:
			return {
				...state,
				authenticationInfo: action.payload,
				error: null
			};
		case typeKeys.REGISTER_FAILED:
			return {
				...state,
				error: action.payload
			};
		case typeKeys.LOGOUT_SUCCEEDED:
			return {
				...state,
				authenticationInfo: null,
				error: null
			};
		case typeKeys.LOGOUT_FAILED:
			return {
				...state,
				error: action.payload
			};
		case typeKeys.POPULATE_USER_STATE_FROM_LOCAL_STORAGE_IF_AVAILABLE_SUCCEEDED: {
			return {
				...state,
				authenticationInfo: action.payload,
				error: null
			};
		}
		case typeKeys.POPULATE_USER_STATE_FROM_LOCAL_STORAGE_IF_AVAILABLE_FAILED: {
			return {
				...state,
				error: action.payload
			};
		}
		default:
			return state;
	}
};
