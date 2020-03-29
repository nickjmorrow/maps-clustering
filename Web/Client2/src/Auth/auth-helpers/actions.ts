import { LoginInfo, RegisterInfo, User } from "./types";
import { action } from "typesafe-actions";
import { typeKeys } from "./typeKeys";
import { GoogleLoginResponse } from "react-google-login";
import { Action } from "redux";

export const login = {
	request: (payload: { loginInfo: LoginInfo; additionalActions?: any[] }) =>
		action(typeKeys.LOGIN, payload),
	success: (user: User) => action(typeKeys.LOGIN_SUCCEEDED, user),
	failure: (error: string) => action(typeKeys.LOGIN_FAILED, error)
};

export const register = {
	request: (registerInfo: RegisterInfo) =>
		action(typeKeys.REGISTER, registerInfo),
	success: (user: User) => action(typeKeys.REGISTER_SUCCEEDED, user),
	failure: (error: string) => action(typeKeys.REGISTER_FAILED, error)
};

export const logout = {
	request: (additionalActions?: Array<() => Action>) =>
		action(typeKeys.LOGOUT, additionalActions),
	success: () => action(typeKeys.LOGOUT_SUCCEEDED),
	failure: (error: string) => action(typeKeys.LOGOUT_FAILED, error)
};

export const authenticateWithGoogle = {
	request: (payload: {
		googleLoginResponse: GoogleLoginResponse;
		additionalActions: Array<() => Action<any>>;
	}) => action(typeKeys.AUTHENTICATE_WITH_GOOGLE, payload),
	success: (data: any) =>
		action(typeKeys.AUTHENTICATE_WITH_GOOGLE_SUCCEEDED, data),
	failure: (error: string) =>
		action(typeKeys.AUTHENTICATE_WITH_GOOGLE_FAILED, error)
};

export const populateUserStateFromLocalStorageIfAvailable = {
	request: () =>
		action(typeKeys.POPULATE_USER_STATE_FROM_LOCAL_STORAGE_IF_AVAILABLE),
	success: (user: User) =>
		action(
			typeKeys.POPULATE_USER_STATE_FROM_LOCAL_STORAGE_IF_AVAILABLE_SUCCEEDED,
			user
		),
	failure: (error: string) =>
		action(
			typeKeys.POPULATE_USER_STATE_FROM_LOCAL_STORAGE_IF_AVAILABLE_FAILED,
			error
		)
};
