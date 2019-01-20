import {
	ILoginInfo,
	IRegisterInfo
} from 'njm-react-component-library/lib/types';
import { action } from 'typesafe-actions';
import { IUser } from './reducer';
import { IError } from '../Core';
import { Action } from 'redux';

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

export const onLogin = {
	request: (payload: {
		loginInfo: ILoginInfo;
		additionalActions?: Array<() => Action>;
	}) => action(authTypeKeys.LOGIN, payload),
	success: (user: IUser) => action(authTypeKeys.LOGIN_SUCCEEDED, user),
	failure: (error: IError) => action(authTypeKeys.LOGIN_FAILED, error)
};

export const onRegister = {
	request: (registerInfo: IRegisterInfo) =>
		action(authTypeKeys.REGISTER, registerInfo),
	success: (user: IUser) => action(authTypeKeys.REGISTER_SUCCEEDED, user),
	failure: (error: IError) => action(authTypeKeys.REGISTER_FAILED, error)
};

export const onLogOut = {
	request: (additionalActions?: any[]) =>
		action(authTypeKeys.LOGOUT, additionalActions),
	success: () => action(authTypeKeys.LOGOUT_SUCCEEDED),
	failure: (error: IError) => action(authTypeKeys.LOGOUT_FAILED, error)
};

export const populateUserStateFromLocalStorageIfAvailable = {
	request: () =>
		action(
			authTypeKeys.POPULATE_USER_STATE_FROM_LOCAL_STORAGE_IF_AVAILABLE
		),
	success: (user: IUser) =>
		action(
			authTypeKeys.POPULATE_USER_STATE_FROM_LOCAL_STORAGE_IF_AVAILABLE_SUCCEEDED,
			user
		),
	failure: (error: IError) =>
		action(
			authTypeKeys.POPULATE_USER_STATE_FROM_LOCAL_STORAGE_IF_AVAILABLE_FAILED,
			error
		)
};
