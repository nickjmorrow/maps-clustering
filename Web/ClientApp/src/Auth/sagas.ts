import axios from 'axios';
import { call, put, takeLatest } from 'redux-saga/effects';
import { action as typesafeAction } from 'typesafe-actions';
import {
	authTypeKeys,
	IFavoriteItemAction,
	IHandleLoginAction,
	IHandleRegisterAction,
	ISetCurrentUserAction
} from './actions';
import { api, USER } from './constants';
import {
	addTokenToDefaultHeader,
	getFromLocalStorage,
	isInLocalStorage,
	removeFromLocalStorage
} from './services';
import { IUser } from './types';

function* handleGetUserFavoriteItems() {
	try {
		const { data } = yield call(axios.get, api.getUserFavoriteItems);
		yield put(
			typesafeAction(authTypeKeys.GET_USER_FAVORITE_ITEMS_SUCCEEDED, data)
		);
	} catch (error) {
		yield put(
			typesafeAction(authTypeKeys.GET_USER_FAVORITE_ITEMS_FAILED, error)
		);
	}
}

function* watchGetUserFavoriteItems() {
	yield takeLatest(
		authTypeKeys.GET_USER_FAVORITE_ITEMS,
		handleGetUserFavoriteItems
	);
}

function* handleLoginAsync(action: IHandleLoginAction) {
	try {
		const { data } = yield call(axios.post, api.login, action.payload);
		addTokenToDefaultHeader(data.token);
		yield [
			put(typesafeAction(authTypeKeys.LOGIN_SUCCEEDED, data)),
			put(
				typesafeAction(
					authTypeKeys.GET_USER_FAVORITE_ITEMS,
					data.userId
				)
			)
		];
	} catch (error) {
		yield put(
			typesafeAction(authTypeKeys.LOGIN_FAILED, error.response.data)
		);
	}
}

function* watchHandleLogin() {
	yield takeLatest(authTypeKeys.LOGIN, handleLoginAsync);
}

function* handleRegisterAsync(action: IHandleRegisterAction) {
	try {
		const { data } = yield call(axios.post, api.register, action.payload);
		yield put(typesafeAction(authTypeKeys.REGISTER_SUCCEEDED, data));
	} catch (error) {
		yield put(
			typesafeAction(authTypeKeys.REGISTER_FAILED, error.response.data)
		);
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
		yield put(typesafeAction(authTypeKeys.LOGOUT_SUCCEEDED));
	} catch (error) {
		console.error(error);
		yield put(typesafeAction(authTypeKeys.LOGOUT_FAILED));
	}
}

function* watchHandleLogOutLocalStorage() {
	yield takeLatest(authTypeKeys.LOGOUT, handleLogOutLocalStorage);
}

function* handleToggleFavoriteItemAsync(action: IFavoriteItemAction) {
	try {
		const { data } = yield call(
			axios.post,
			api.toggleFavoriteItem(action.payload),
			action.payload
		);
		yield put(typesafeAction(authTypeKeys.FAVORITE_ITEM_SUCCEEDED, data));
	} catch (error) {
		yield put(typesafeAction(authTypeKeys.FAVORITE_ITEM_FAILED, error));
	}
}

function* watchHandleToggleFavoriteItem() {
	yield takeLatest(authTypeKeys.FAVORITE_ITEM, handleToggleFavoriteItemAsync);
}

function* handleSetCurrentUser(action: ISetCurrentUserAction) {
	try {
		addTokenToDefaultHeader(action.payload.token);
		const user = getFromLocalStorage(USER);
		yield [
			put(typesafeAction(authTypeKeys.SET_CURRENT_USER_SUCCEEDED, user)),
			put(typesafeAction(authTypeKeys.GET_USER_FAVORITE_ITEMS))
		];
	} catch (error) {
		yield put(typesafeAction(authTypeKeys.SET_CURRENT_USER_FAILED, error));
	}
}

function* watchHandleSetCurrentUser() {
	yield takeLatest(authTypeKeys.SET_CURRENT_USER, handleSetCurrentUser);
}

function* handlePopulateUserStateFromLocalStorageIfAvailable() {
	try {
		if (localStorage.getItem(USER) !== null) {
			const user: IUser = JSON.parse(localStorage.getItem(USER)!);
			addTokenToDefaultHeader(user.token);
			yield put(
				typesafeAction(
					authTypeKeys.POPULATE_USER_STATE_FROM_LOCAL_STORAGE_IF_AVAILABLE_SUCCEEDED,
					user
				)
			);
		}
	} catch (error) {
		console.error(error);
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
	watchHandleToggleFavoriteItem,
	watchGetUserFavoriteItems,
	watchHandleSetCurrentUser,
	watchHandleLogOutLocalStorage,
	watchHandlePopulateUserStateFromLocalStorageIfAvailable
];
