import axios from 'axios';
import { action as typesafeAction } from 'typesafe-actions';
import { takeLatest, put, call } from 'redux-saga/effects';
import { dataTypeKeys } from './actions';
import { api } from './constants';

export function* watchGetData() {
	yield takeLatest(dataTypeKeys.GET_DATA, getDataAsync);
}

function* getDataAsync() {
	try {
		const { data } = yield call(axios.get, api.get);
		yield put(typesafeAction(dataTypeKeys.GET_DATA_SUCCEEDED, data));
	} catch (error) {
		yield put(
			typesafeAction(dataTypeKeys.GET_DATA_FAILED, error.response.data)
		);
	}
}
