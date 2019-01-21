import { all, call, put, takeLatest } from 'redux-saga/effects';
import { authSagas } from './Auth/sagas';
import { dataSagas } from './Data';
import {
	onLogin,
	api,
	addTokenToDefaultHeader,
	addToLocalStorage,
	USER,
	authTypeKeys
} from 'njm-react-component-library';
import axios from 'axios';

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

const allSagas = [...authSagas, ...dataSagas, watchHandleLogin];

export function* rootSaga() {
	yield all([...allSagas.map(s => s())]);
}
