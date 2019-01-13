import { action } from 'typesafe-actions';
import {
	ILoginInfo,
	IRegisterInfo
} from 'njm-react-component-library/lib/types';
import { IUser, userFavoriteItemId } from './types';
import { error } from 'src/Core/types';

export enum authTypeKeys {
	LOGIN = 'LOGIN',
	LOGIN_SUCCEEDED = 'LOGIN_SUCCEEDED',
	LOGIN_FAILED = 'LOGIN_FAILED',
	REGISTER = 'REGISTER',
	REGISTER_SUCCEEDED = 'REGISTER_SUCCEEDED',
	REGISTER_FAILED = 'REGISTER_FAILED',
	LOGOUT = 'LOGOUT',
	LOGOUT_SUCCEEDED = 'LOGOUT_SUCCEEDED',
	LOGOUT_FAILED = 'LOGOUT_FAILED',
	SET_CURRENT_USER = 'SET_CURRENT_USER',
	SET_CURRENT_USER_SUCCEEDED = 'SET_CURRENT_USER_SUCCEEDED',
	SET_CURRENT_USER_FAILED = 'SET_CURRENT_USER_FAILED',
	FAVORITE_ITEM = 'FAVORITE_ITEM',
	FAVORITE_ITEM_SUCCEEDED = 'FAVORITE_ITEM_SUCCEEDED',
	FAVORITE_ITEM_FAILED = 'FAVORITE_ITEM_FAILED',
	GET_USER_FAVORITE_ITEMS = 'GET_USER_FAVORITE_ITEMS',
	GET_USER_FAVORITE_ITEMS_SUCCEEDED = 'GET_USER_FAVORITE_ITEMS_SUCCEEDED',
	GET_USER_FAVORITE_ITEMS_FAILED = 'GET_USER_FAVORITE_ITEMS_FAILED'
}

export type ActionTypes =
	| IHandleLoginAction
	| IHandleRegisterAction
	| IHandleLoginSucceededAction
	| IHandleLoginFailedAction
	| IHandleRegisterSucceededAction
	| IHandleRegisterFailedAction
	| IHandleLogOutAction
	| IHandleLogOutSucceededAction
	| IHandleLogOutFailedAction
	| ISetCurrentUserAction
	| ISetCurrentUserActionSucceeded
	| ISetCurrentUserActionFailed
	| IFavoriteItemAction
	| IFavoriteItemActionSucceeded
	| IFavoriteItemActionFailed
	| IGetUserFavoriteItemsAction
	| IGetUserFavoriteItemsActionSucceeded
	| IGetUserFavoriteItemsActionFailed;

export const handleLogin = (loginInfo: ILoginInfo): IHandleLoginAction =>
	action(authTypeKeys.LOGIN, loginInfo);

export const handleRegister = (
	registerInfo: IRegisterInfo
): IHandleRegisterAction => action(authTypeKeys.REGISTER, registerInfo);

export const setCurrentUser = (currentUser: IUser): ISetCurrentUserAction =>
	action(authTypeKeys.SET_CURRENT_USER, currentUser);

export const toggleFavoriteItem = (itemId: number): IFavoriteItemAction =>
	action(authTypeKeys.FAVORITE_ITEM, itemId);

export const handleLogOut = (): IHandleLogOutAction =>
	action(authTypeKeys.LOGOUT);

export const getUserFavoriteItems = (
	userId: number
): IGetUserFavoriteItemsAction =>
	action(authTypeKeys.GET_USER_FAVORITE_ITEMS, userId);

export interface IHandleLoginAction {
	type: authTypeKeys.LOGIN;
	payload: ILoginInfo;
}

export interface IHandleLoginSucceededAction {
	type: authTypeKeys.LOGIN_SUCCEEDED;
	payload: IUser;
}

export interface IHandleLoginFailedAction {
	type: authTypeKeys.LOGIN_FAILED;
	payload: string;
}

export interface IHandleRegisterAction {
	type: authTypeKeys.REGISTER;
	payload: IRegisterInfo;
}

export interface IHandleRegisterSucceededAction {
	type: authTypeKeys.REGISTER_SUCCEEDED;
	payload: IUser;
}

export interface IHandleRegisterFailedAction {
	type: authTypeKeys.REGISTER_FAILED;
	payload: error;
}

export interface IHandleLogOutAction {
	type: authTypeKeys.LOGOUT;
}

export interface IHandleLogOutSucceededAction {
	type: authTypeKeys.LOGOUT_SUCCEEDED;
}

export interface IHandleLogOutFailedAction {
	type: authTypeKeys.LOGOUT_FAILED;
}

export interface ISetCurrentUserAction {
	type: authTypeKeys.SET_CURRENT_USER;
	payload: IUser;
}

export interface ISetCurrentUserActionSucceeded {
	type: authTypeKeys.SET_CURRENT_USER_SUCCEEDED;
	payload: IUser;
}

export interface ISetCurrentUserActionFailed {
	type: authTypeKeys.SET_CURRENT_USER_FAILED;
	payload: error;
}

export interface IFavoriteItemAction {
	type: authTypeKeys.FAVORITE_ITEM;
	payload: number;
}

export interface IFavoriteItemActionSucceeded {
	type: authTypeKeys.FAVORITE_ITEM_SUCCEEDED;
	payload: number;
}

export interface IFavoriteItemActionFailed {
	type: authTypeKeys.FAVORITE_ITEM_FAILED;
	payload: string;
}

export interface IGetUserFavoriteItemsAction {
	type: authTypeKeys.GET_USER_FAVORITE_ITEMS;
}

export interface IGetUserFavoriteItemsActionSucceeded {
	type: authTypeKeys.GET_USER_FAVORITE_ITEMS_SUCCEEDED;
	payload: userFavoriteItemId[];
}

export interface IGetUserFavoriteItemsActionFailed {
	type: authTypeKeys.GET_USER_FAVORITE_ITEMS_FAILED;
	payload: string;
}
