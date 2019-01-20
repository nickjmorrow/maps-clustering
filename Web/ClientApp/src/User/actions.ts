import { action } from 'typesafe-actions';
import { IError } from 'src/Auth'; // TODO: move to core

export enum userTypeKeys {
	FAVORITE_ITEM = 'FAVORITE_ITEM',
	FAVORITE_ITEM_SUCCEEDED = 'FAVORITE_ITEM_SUCCEEDED',
	FAVORITE_ITEM_FAILED = 'FAVORITE_ITEM_FAILED',
	GET_USER_FAVORITE_ITEMS = 'GET_USER_FAVORITE_ITEMS',
	GET_USER_FAVORITE_ITEMS_SUCCEEDED = 'GET_USER_FAVORITE_ITEMS_SUCCEEDED',
	GET_USER_FAVORITE_ITEMS_FAILED = 'GET_USER_FAVORITE_ITEMS_FAILED'
}

export type ActionTypes =
	| IFavoriteItemAction
	| IFavoriteItemActionSucceeded
	| IFavoriteItemActionFailed
	| IGetUserFavoriteItemsAction
	| IGetUserFavoriteItemsActionSucceeded
	| IGetUserFavoriteItemsActionFailed;

export const toggleFavoriteItem = {
	request: (itemId: number): IFavoriteItemAction =>
		action(userTypeKeys.FAVORITE_ITEM, itemId),
	success: (itemId: number): IFavoriteItemActionSucceeded =>
		action(userTypeKeys.FAVORITE_ITEM_SUCCEEDED, itemId),
	failure: (error: IError): IFavoriteItemActionFailed =>
		action(userTypeKeys.FAVORITE_ITEM_FAILED, error)
};

export const getUserFavoriteItems = {
	request: (userId: number): IGetUserFavoriteItemsAction =>
		action(userTypeKeys.GET_USER_FAVORITE_ITEMS, userId),
	success: (userItemIds: number[]): IGetUserFavoriteItemsActionSucceeded =>
		action(userTypeKeys.GET_USER_FAVORITE_ITEMS_SUCCEEDED, userItemIds),
	failure: (error: IError) =>
		action(userTypeKeys.GET_USER_FAVORITE_ITEMS_FAILED, error)
};

export interface IFavoriteItemAction {
	type: userTypeKeys.FAVORITE_ITEM;
	payload: number;
}

export interface IFavoriteItemActionSucceeded {
	type: userTypeKeys.FAVORITE_ITEM_SUCCEEDED;
	payload: number;
}

export interface IFavoriteItemActionFailed {
	type: userTypeKeys.FAVORITE_ITEM_FAILED;
	payload: string;
}

export interface IGetUserFavoriteItemsAction {
	type: userTypeKeys.GET_USER_FAVORITE_ITEMS;
}

export interface IGetUserFavoriteItemsActionSucceeded {
	type: userTypeKeys.GET_USER_FAVORITE_ITEMS_SUCCEEDED;
	payload: number[];
}

export interface IGetUserFavoriteItemsActionFailed {
	type: userTypeKeys.GET_USER_FAVORITE_ITEMS_FAILED;
	payload: string;
}
