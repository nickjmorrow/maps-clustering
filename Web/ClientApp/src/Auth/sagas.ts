import axios from 'axios';
import { call, put, takeLatest } from 'redux-saga/effects';
import {
	authTypeKeys,
	handleLogin,
	handleLogOut,
	handleRegister,
	IHandleLoginAction,
	IHandleRegisterAction,
	populateUserStateFromLocalStorageIfAvailable
} from './actions';
import { api, USER } from './constants';
import {
	addTokenToDefaultHeader,
	isInLocalStorage,
	removeFromLocalStorage
} from './services';
import { IUser } from './types';
import { getUserFavoriteItems } from 'src/User/actions';

function* handleLoginAsync(action: IHandleLoginAction) {
	try {
		const { data } = yield call(axios.post, api.login, action.payload);
		addTokenToDefaultHeader(data.token);
		localStorage.setItem(USER, JSON.stringify(data));
		yield [
			put(handleLogin.success(data)),
			put(getUserFavoriteItems.request(data.userId))
		];
	} catch (error) {
		yield put(handleLogin.failure(error));
	}
}

function* watchHandleLogin() {
	yield takeLatest(authTypeKeys.LOGIN, handleLoginAsync);
}

function* handleRegisterAsync(action: IHandleRegisterAction) {
	try {
		const { data } = yield call(axios.post, api.register, action.payload);
		yield put(handleRegister.success(data));
	} catch (error) {
		yield put(handleRegister.failure(error));
	}
}

function* watchHandleRegister() {
	yield takeLatest(authTypeKeys.REGISTER, handleRegisterAsync);
}

function* handleLogOutLocalStorage() {
	try {
		if (isInLocalStorage(USER)) {
			removeFromLocalStorage(USER);
		}
		yield put(handleLogOut.success());
	} catch (error) {
		yield put(handleLogOut.failure(error));
	}
}

function* watchHandleLogOutLocalStorage() {
	yield takeLatest(authTypeKeys.LOGOUT, handleLogOutLocalStorage);
}

function* handlePopulateUserStateFromLocalStorageIfAvailable() {
	try {
		const storedUser = localStorage.getItem(USER);
		if (storedUser !== null) {
			const user: IUser = JSON.parse(storedUser);
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
		authTypeKeys.POPULATE_USER_STATE_FROM_LOCAL_STORAGE_IF_AVAILABLE,
		handlePopulateUserStateFromLocalStorageIfAvailable
	);
}

export const sagas = [
	watchHandleLogin,
	watchHandleRegister,
	watchHandleLogOutLocalStorage,
	watchHandlePopulateUserStateFromLocalStorageIfAvailable
];
