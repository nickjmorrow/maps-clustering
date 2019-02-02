import axios from 'axios';
import {
	authServices,
	authConstants,
	authActions,
	coreServices
} from 'njm-react-component-library';
import { IUser } from 'njm-react-component-library/lib/Auth/types';
import { all, call, put, PutEffect, takeLatest } from 'redux-saga/effects';

const {
	onLogin,
	onRegister,
	onLogOut,
	onPopulateUserStateFromLocalStorageIfAvailable,
	authTypeKeys
} = authActions;
const { addTokenToDefaultHeader } = authServices;
const { localStorageKeys, authApi } = authConstants;
const {
	addToLocalStorage,
	isInLocalStorage,
	removeFromLocalStorage
} = coreServices;

function* handleLoginAsync(action: ReturnType<typeof onLogin.request>) {
	try {
		const { data } = yield call(
			axios.post,
			authApi.login,
			action.payload.loginInfo
		);
		// TODO: decode token to ensure it hasnt expired
		addTokenToDefaultHeader(data.token);
		addToLocalStorage(data, localStorageKeys.USER);

		const actions = action.payload.additionalActions
			? [...action.payload.additionalActions.map(f => put(f()))]
			: [];
		actions.push(put(onLogin.success(data)));
		yield all(actions);
	} catch (error) {
		yield put(onLogin.failure(error));
	}
}

function* watchHandleLogin() {
	yield takeLatest(authTypeKeys.LOGIN, handleLoginAsync);
}

export function* handleAuthenticateWithGoogleAsync(
	action: ReturnType<typeof authActions.onAuthenticateWithGoogle.request>
) {
	const { payload } = action;
	const formattedGoogleResponse = {
		name: payload.getBasicProfile().getName(),
		email: payload.getBasicProfile().getEmail(),
		tokenId: payload.getAuthResponse().id_token
	};

	try {
		const { data } = yield call(
			axios.post,
			authApi.authenticateWithGoogle,
			formattedGoogleResponse
		);
		addTokenToDefaultHeader(data.token);
		addToLocalStorage(data, localStorageKeys.USER);
		yield put(authActions.onAuthenticateWithGoogle.success(data));
	} catch (error) {
		yield put(authActions.onAuthenticateWithGoogle.failure(error));
	}
}

export function* watchAuthenticateWithGoogle() {
	yield takeLatest(
		authTypeKeys.AUTHENTICATE_WITH_GOOGLE,
		handleAuthenticateWithGoogleAsync
	);
}

function* handleRegisterAsync(action: ReturnType<typeof onRegister.request>) {
	try {
		const { data } = yield call(
			axios.post,
			authApi.register,
			action.payload
		);
		yield put(onRegister.success(data));
	} catch (error) {
		yield put(onRegister.failure(error));
	}
}

function* watchHandleRegister() {
	yield takeLatest(authTypeKeys.REGISTER, handleRegisterAsync);
}

function* handleLogOutLocalStorage(
	action: ReturnType<typeof onLogOut.request>
) {
	try {
		if (isInLocalStorage(localStorageKeys.USER)) {
			removeFromLocalStorage(localStorageKeys.USER);
		}
		const actions: Array<PutEffect<any>> = action.payload
			? [...action.payload.map(f => put(f()))]
			: [];
		actions.push(put(onLogOut.success()));
		yield all(actions);
	} catch (error) {
		yield put(onLogOut.failure(error));
	}
}

function* watchHandleLogOutLocalStorage() {
	yield takeLatest(authTypeKeys.LOGOUT, handleLogOutLocalStorage);
}

function* handlePopulateUserStateFromLocalStorageIfAvailable() {
	try {
		const storedUser = localStorage.getItem(localStorageKeys.USER);
		if (storedUser !== null) {
			const user: IUser = JSON.parse(storedUser);
			addTokenToDefaultHeader(user.token);
			yield put(
				onPopulateUserStateFromLocalStorageIfAvailable.success(user)
			);
		}
	} catch (error) {
		yield put(
			onPopulateUserStateFromLocalStorageIfAvailable.failure(error)
		);
	}
}

function* watchHandlePopulateUserStateFromLocalStorageIfAvailable() {
	yield takeLatest(
		authTypeKeys.POPULATE_USER_STATE_FROM_LOCAL_STORAGE_IF_AVAILABLE,
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
