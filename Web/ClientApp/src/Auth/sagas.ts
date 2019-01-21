import {
	all,
	put,
	PutEffect,
	takeLatest,
	call
} from '@redux-saga/core/effects';
import {
	addTokenToDefaultHeader,
	addToLocalStorage,
	api,
	authTypeKeys,
	isInLocalStorage,
	IUser,
	onLogin,
	onLogOut,
	onRegister,
	populateUserStateFromLocalStorageIfAvailable,
	removeFromLocalStorage,
	USER
} from 'njm-react-component-library';
import axios from 'axios';

// import 'regenerator-runtime';
function* handleLoginAsync(action: ReturnType<typeof onLogin.request>) {
	try {
		const { data } = yield call(
			axios.post,
			api.login,
			action.payload.loginInfo
		);
		addTokenToDefaultHeader(data.token);
		addToLocalStorage(data, USER);

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

function* handleRegisterAsync(action: ReturnType<typeof onRegister.request>) {
	try {
		const { data } = yield call(axios.post, api.register, action.payload);
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
		if (isInLocalStorage(USER)) {
			removeFromLocalStorage(USER);
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

export const authSagas = [
	watchHandleLogin,
	watchHandleRegister,
	watchHandleLogOutLocalStorage,
	watchHandlePopulateUserStateFromLocalStorageIfAvailable
];
