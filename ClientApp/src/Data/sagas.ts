import axios from 'axios';
import { action as typesafeAction } from 'typesafe-actions';
import { takeLatest, put, call } from 'redux-saga/effects';
import { dataTypeKeys, GetMapDataAction } from './actions';
import { api, localStorageKeys, formHeaders } from './constants';

export function* watchGetMapData() {
	yield takeLatest(dataTypeKeys.GET_DATA, getMapDataAsync);
}

function* getMapDataAsync(action: GetMapDataAction) {
	try {
		const { data } = yield call(
			axios.post,
			api.upload,
			action.payload,
			formHeaders
		);
		yield put(typesafeAction(dataTypeKeys.GET_DATA_SUCCEEDED, data));
		localStorage.setItem(localStorageKeys.points, JSON.stringify(data));
	} catch (error) {
		yield put(
			typesafeAction(dataTypeKeys.GET_DATA_FAILED, error.response.data)
		);
	}
}
