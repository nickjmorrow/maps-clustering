import { IReduxState } from 'src/reducer';

export const getAuth = (state: IReduxState) => state.auth;

export const getFavoritedItemIds = (state: IReduxState): number[] =>
	getAuth(state).favoritedItemIds;

export const isInFavoritedItemIds = (
	state: IReduxState,
	itemId: number
): boolean =>
	state.auth.favoritedItemIds.find(ii => ii === itemId) !== undefined;

export const isAuthorized = (state: IReduxState): boolean => {
	return state.auth.user !== null && state.auth.user.userId !== null;
};
