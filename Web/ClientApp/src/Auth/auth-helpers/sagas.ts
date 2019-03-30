import axios from "axios";
import { addTokenToDefaultHeader } from "./services";
import { localStorageKeys, api } from "./constants";
import { User } from "./types";
import { all, call, put, PutEffect, takeLatest } from "redux-saga/effects";
import {
	login,
	register,
	logout,
	authenticateWithGoogle,
	populateUserStateFromLocalStorageIfAvailable
} from "./actions";
import { typeKeys } from "./typeKeys";

import {
	addToLocalStorage,
	removeFromLocalStorage,
	isInLocalStorage
} from "Core";

function* handleLoginAsync(action: ReturnType<typeof login.request>) {
	try {
		const { data } = yield call(
			axios.post,
			api.login,
			action.payload.loginInfo
		);
		// TODO: decode token to ensure it hasnt expired
		if (!data.userId) {
			throw new Error("UserId not found in payload.");
		}
		addTokenToDefaultHeader(data.token);
		addToLocalStorage(data, localStorageKeys.user);

		const actions = action.payload.additionalActions
			? [...action.payload.additionalActions.map(f => put(f()))]
			: [];
		actions.push(put(login.success(data)));
		yield all(actions);
	} catch (error) {
		yield put(login.failure(error));
	}
}

function* watchHandleLogin() {
	yield takeLatest(typeKeys.LOGIN, handleLoginAsync);
}

export function* handleAuthenticateWithGoogleAsync(
	action: ReturnType<typeof authenticateWithGoogle.request>
) {
	const { payload } = action;
	const formattedGoogleResponse = {
		name: payload.googleLoginResponse.getBasicProfile().getName(),
		email: payload.googleLoginResponse.getBasicProfile().getEmail(),
		token: payload.googleLoginResponse.getAuthResponse().id_token
	};

	try {
		// TODO: what type is this?
		const { data } = yield call(
			axios.post,
			api.authenticateWithGoogle,
			formattedGoogleResponse
		);
		addTokenToDefaultHeader(data.token);
		addToLocalStorage(data, localStorageKeys.user);
		const actions = action.payload.additionalActions
			? [...action.payload.additionalActions.map(f => put(f()))]
			: [];
		actions.push(put(authenticateWithGoogle.success(data)));
		yield all(actions);
	} catch (error) {
		yield put(authenticateWithGoogle.failure(error));
	}
}

export function* watchAuthenticateWithGoogle() {
	yield takeLatest(
		typeKeys.AUTHENTICATE_WITH_GOOGLE,
		handleAuthenticateWithGoogleAsync
	);
}

function* handleRegisterAsync(action: ReturnType<typeof register.request>) {
	try {
		const { data } = yield call(axios.post, api.register, action.payload);
		yield put(register.success(data));
	} catch (error) {
		yield put(register.failure(error));
	}
}

function* watchHandleRegister() {
	yield takeLatest(typeKeys.REGISTER, handleRegisterAsync);
}

function* handleLogOutLocalStorage(action: ReturnType<typeof logout.request>) {
	try {
		if (isInLocalStorage(localStorageKeys.user)) {
			removeFromLocalStorage(localStorageKeys.user);
		}
		const actions: Array<PutEffect<any>> = action.payload
			? [...action.payload.map(f => put(f()))]
			: [];
		actions.push(put(logout.success()));
		yield all(actions);
	} catch (error) {
		yield put(logout.failure(error));
	}
}

function* watchHandleLogOutLocalStorage() {
	yield takeLatest(typeKeys.LOGOUT, handleLogOutLocalStorage);
}

function* handlePopulateUserStateFromLocalStorageIfAvailable() {
	try {
		const storedUser = localStorage.getItem(localStorageKeys.user);
		if (storedUser !== null) {
			const user: User = JSON.parse(storedUser);
			addTokenToDefaultHeader(user.token);
			yield put(
				populateUserStateFromLocalStorageIfAvailable.success(user)
			);
		}
	} catch (error) {
		yield put(populateUserStateFromLocalStorageIfAvailable.failure(error));
	}
}

function* watchHandlePopulateUserStateFromLocalStorageIfAvailable() {
	yield takeLatest(
		typeKeys.POPULATE_USER_STATE_FROM_LOCAL_STORAGE_IF_AVAILABLE,
		handlePopulateUserStateFromLocalStorageIfAvailable
	);
}

export const authSagas = [
	watchHandleLogin,
	watchAuthenticateWithGoogle,
	watchHandleRegister,
	watchHandleLogOutLocalStorage,
	watchHandlePopulateUserStateFromLocalStorageIfAvailable
];
