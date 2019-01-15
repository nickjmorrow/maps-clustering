import { ActionTypes, authTypeKeys } from './actions';
import { IUser } from './types';
import { addTokenToDefaultHeader, addToLocalStorage } from './services';
import { USER } from './constants';

export interface IAuthState {
	readonly user: IUser | null;
	readonly error: string | null;
	readonly favoritedItemIds: number[];
}

const initialState: IAuthState = {
	user: null,
	error: null,
	favoritedItemIds: []
};

export const authReducer = (
	state: IAuthState,
	action: ActionTypes
): IAuthState => {
	state = state || initialState;

	switch (action.type) {
		case authTypeKeys.LOGIN_SUCCEEDED:
			addTokenToDefaultHeader(action.payload.token);
			addToLocalStorage(action.payload, USER);
			return {
				...state,
				user: action.payload,
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
				user: action.payload,
				error: null
			};
		case authTypeKeys.REGISTER_FAILED:
			return {
				...state,
				error: action.payload
			};
		case authTypeKeys.SET_CURRENT_USER_SUCCEEDED:
			return {
				...state,
				user: action.payload
			};
		case authTypeKeys.FAVORITE_ITEM_SUCCEEDED:
			return {
				...state,
				favoritedItemIds: toggleFavoriteItem(state, action.payload)
			};
		case authTypeKeys.GET_USER_FAVORITE_ITEMS_SUCCEEDED:
			return {
				...state,
				favoritedItemIds: action.payload
			};
		case authTypeKeys.LOGOUT_SUCCEEDED:
			return {
				...state,
				user: null,
				favoritedItemIds: []
			};
		case authTypeKeys.POPULATE_USER_STATE_FROM_LOCAL_STORAGE_IF_AVAILABLE_SUCCEEDED: {
			return {
				...state,
				user: action.payload
			};
		}
		default:
			return state;
	}
};

const toggleFavoriteItem = (state: IAuthState, itemId: number): number[] =>
	state.favoritedItemIds.find(x => x === itemId)
		? state.favoritedItemIds.filter(x => x !== itemId)
		: [...state.favoritedItemIds, itemId];
