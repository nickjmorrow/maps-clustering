import { ActionTypes, userTypeKeys } from './actions';

export interface IUserState {
	readonly error: string | null;
	readonly favoritedItemIds: number[];
}

const initialState: IUserState = {
	error: null,
	favoritedItemIds: []
};

export const userReducer = (
	state: IUserState,
	action: ActionTypes
): IUserState => {
	state = state || initialState;

	switch (action.type) {
		case userTypeKeys.FAVORITE_ITEM_SUCCEEDED:
			return {
				...state,
				favoritedItemIds: toggleFavoriteItem(state, action.payload)
			};
		case userTypeKeys.GET_USER_FAVORITE_ITEMS_SUCCEEDED:
			return {
				...state,
				favoritedItemIds: action.payload
			};
		default:
			return state;
	}
};

const toggleFavoriteItem = (userState: IUserState, itemId: number): number[] =>
	userState.favoritedItemIds.find(x => x === itemId)
		? userState.favoritedItemIds.filter(x => x !== itemId)
		: [...userState.favoritedItemIds, itemId];
