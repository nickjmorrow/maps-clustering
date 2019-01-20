import { action } from 'typesafe-actions';
import { IError } from 'src/Core';
import { IItem } from './types';

export enum userTypeKeys {
	FAVORITE_ITEM = 'FAVORITE_ITEM',
	FAVORITE_ITEM_SUCCEEDED = 'FAVORITE_ITEM_SUCCEEDED',
	FAVORITE_ITEM_FAILED = 'FAVORITE_ITEM_FAILED',
	GET_USER_FAVORITE_ITEMS = 'GET_USER_FAVORITE_ITEMS',
	GET_USER_FAVORITE_ITEMS_SUCCEEDED = 'GET_USER_FAVORITE_ITEMS_SUCCEEDED',
	GET_USER_FAVORITE_ITEMS_FAILED = 'GET_USER_FAVORITE_ITEMS_FAILED',
	GET_ITEMS = 'GET_ITEMS',
	GET_ITEMS_SUCCEEDED = 'GET_ITEMS_SUCCEEDED',
	GET_ITEMS_FAILED = 'GET_ITEMS_FAILED'
}

export type ActionTypes =
	| IFavoriteItemAction
	| IFavoriteItemActionSucceeded
	| IFavoriteItemActionFailed
	| IGetUserFavoriteItemsAction
	| IGetUserFavoriteItemsActionSucceeded
	| IGetUserFavoriteItemsActionFailed
	| IGetItemsAction
	| IGetItemsActionSucceeded
	| IGetItemsActionFailed;

const toggleFavoriteItem = {
	request: (itemId: number): IFavoriteItemAction =>
		action(userTypeKeys.FAVORITE_ITEM, itemId),
	success: (itemId: number): IFavoriteItemActionSucceeded =>
		action(userTypeKeys.FAVORITE_ITEM_SUCCEEDED, itemId),
	failure: (error: IError): IFavoriteItemActionFailed =>
		action(userTypeKeys.FAVORITE_ITEM_FAILED, error)
};

const getUserFavoriteItems = {
	request: (): IGetUserFavoriteItemsAction =>
		action(userTypeKeys.GET_USER_FAVORITE_ITEMS),
	success: (userItemIds: number[]): IGetUserFavoriteItemsActionSucceeded =>
		action(userTypeKeys.GET_USER_FAVORITE_ITEMS_SUCCEEDED, userItemIds),
	failure: (error: IError) =>
		action(userTypeKeys.GET_USER_FAVORITE_ITEMS_FAILED, error)
};

const getItems = {
	request: (): IGetItemsAction => action(userTypeKeys.GET_ITEMS),
	success: (payload: IItem[]): IGetItemsActionSucceeded =>
		action(userTypeKeys.GET_ITEMS_SUCCEEDED, payload),
	failure: (payload: IError): IGetItemsActionFailed =>
		action(userTypeKeys.GET_ITEMS_FAILED, payload)
};

export const userActions = {
	toggleFavoriteItem,
	getUserFavoriteItems,
	getItems
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

export interface IGetItemsAction {
	type: userTypeKeys.GET_ITEMS;
}

export interface IGetItemsActionSucceeded {
	type: userTypeKeys.GET_ITEMS_SUCCEEDED;
	payload: IItem[];
}

export interface IGetItemsActionFailed {
	type: userTypeKeys.GET_ITEMS_FAILED;
	payload: IError;
}
