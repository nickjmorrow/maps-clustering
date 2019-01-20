import {
	ILoginInfo,
	IRegisterInfo
} from 'njm-react-component-library/lib/types';
import { action } from 'typesafe-actions';
import { IUser } from './types';
import { IError } from '../Core';

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
	POPULATE_USER_STATE_FROM_LOCAL_STORAGE_IF_AVAILABLE = 'POPULATE_USER_STATE_FROM_LOCAL_STORAGE_IF_AVAILABLE',
	POPULATE_USER_STATE_FROM_LOCAL_STORAGE_IF_AVAILABLE_SUCCEEDED = 'POPULATE_USER_STATE_FROM_LOCAL_STORAGE_IF_AVAILABLE_SUCCEEDED',
	POPULATE_USER_STATE_FROM_LOCAL_STORAGE_IF_AVAILABLE_FAILED = 'POPULATE_USER_STATE_FROM_LOCAL_STORAGE_IF_AVAILABLE_FAILED'
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
	| IPopulateUserStateFromLocalStorageIfAvailableAction
	| IPopulateUserStateFromLocalStorageIfAvailableActionSucceeded
	| IPopulateUserStateFromLocalStorageIfAvailableActionFailed;

export const handleLogin = {
	request: (payload: {
		loginInfo: ILoginInfo;
		additionalActions?: any[];
	}): IHandleLoginAction => action(authTypeKeys.LOGIN, payload),
	success: (user: IUser): IHandleLoginSucceededAction =>
		action(authTypeKeys.LOGIN_SUCCEEDED, user),
	failure: (error: IError): IHandleLoginFailedAction =>
		action(authTypeKeys.LOGIN_FAILED, error)
};

export const handleRegister = {
	request: (registerInfo: IRegisterInfo): IHandleRegisterAction =>
		action(authTypeKeys.REGISTER, registerInfo),
	success: (user: IUser): IHandleRegisterSucceededAction =>
		action(authTypeKeys.REGISTER_SUCCEEDED, user),
	failure: (error: IError): IHandleRegisterFailedAction =>
		action(authTypeKeys.REGISTER_FAILED, error)
};

export const handleLogOut = {
	request: (additionalActions?: any[]): IHandleLogOutAction =>
		action(authTypeKeys.LOGOUT, additionalActions),
	success: (): IHandleLogOutSucceededAction =>
		action(authTypeKeys.LOGOUT_SUCCEEDED),
	failure: (error: IError): IHandleLogOutFailedAction =>
		action(authTypeKeys.LOGOUT_FAILED, error)
};

export const populateUserStateFromLocalStorageIfAvailable = {
	request: (): IPopulateUserStateFromLocalStorageIfAvailableAction =>
		action(
			authTypeKeys.POPULATE_USER_STATE_FROM_LOCAL_STORAGE_IF_AVAILABLE
		),
	success: (
		user: IUser
	): IPopulateUserStateFromLocalStorageIfAvailableActionSucceeded =>
		action(
			authTypeKeys.POPULATE_USER_STATE_FROM_LOCAL_STORAGE_IF_AVAILABLE_SUCCEEDED,
			user
		),
	failure: (
		error: IError
	): IPopulateUserStateFromLocalStorageIfAvailableActionFailed =>
		action(
			authTypeKeys.POPULATE_USER_STATE_FROM_LOCAL_STORAGE_IF_AVAILABLE_FAILED,
			error
		)
};

export interface IHandleLoginAction {
	type: authTypeKeys.LOGIN;
	payload: {
		loginInfo: ILoginInfo;
		additionalActions?: any[];
	};
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
	payload: IError;
}

export interface IHandleLogOutAction {
	type: authTypeKeys.LOGOUT;
	payload?: any[];
}

export interface IHandleLogOutSucceededAction {
	type: authTypeKeys.LOGOUT_SUCCEEDED;
}

export interface IHandleLogOutFailedAction {
	type: authTypeKeys.LOGOUT_FAILED;
	payload: IError;
}

export interface IPopulateUserStateFromLocalStorageIfAvailableAction {
	type: authTypeKeys.POPULATE_USER_STATE_FROM_LOCAL_STORAGE_IF_AVAILABLE;
}

export interface IPopulateUserStateFromLocalStorageIfAvailableActionSucceeded {
	type: authTypeKeys.POPULATE_USER_STATE_FROM_LOCAL_STORAGE_IF_AVAILABLE_SUCCEEDED;
	payload: IUser;
}

export interface IPopulateUserStateFromLocalStorageIfAvailableActionFailed {
	type: authTypeKeys.POPULATE_USER_STATE_FROM_LOCAL_STORAGE_IF_AVAILABLE_FAILED;
	payload: IError;
}
