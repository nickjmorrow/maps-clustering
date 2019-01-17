import axios from 'axios';
import { action as typesafeAction } from 'typesafe-actions';
import { takeLatest, put, call } from 'redux-saga/effects';
import {
	dataTypeKeys,
	GetMapPointsAction,
	GetAhcAction,
	GetDbscanAction
} from './actions';
import {
	fileApi,
	localStorageKeys,
	formHeaders,
	calcApi,
	pointsApi
} from './constants';

function* watchCreatePointsGroup() {
	yield takeLatest(dataTypeKeys.CREATE_POINTS_GROUP, createPointsGroupAsync);
}

function* createPointsGroupAsync(action: GetMapPointsAction) {
	try {
		const { data } = yield call(
			axios.post,
			fileApi.upload,
			action.payload,
			formHeaders
		);
		yield put(
			typesafeAction(dataTypeKeys.CREATE_POINTS_GROUP_SUCCEEDED, data)
		);
		localStorage.setItem(localStorageKeys.points, JSON.stringify(data));
	} catch (error) {
		yield put(
			typesafeAction(dataTypeKeys.GET_DATA_FAILED, error.response.data)
		);
	}
}

function* watchGetAhcs() {
	yield takeLatest(dataTypeKeys.GET_AHCS, getAhcsAsync);
}

function* getAhcsAsync(action: GetAhcAction) {
	try {
		const { data } = yield call(
			axios.post,
			calcApi.getAgglomerativeHierarchicalClusters,
			action.payload
		);
		yield put(typesafeAction(dataTypeKeys.GET_AHCS_SUCCEEDED, data));
	} catch (error) {
		yield put(
			typesafeAction(dataTypeKeys.GET_AHCS_FAILED, error.response.data)
		);
	}
}

function* watchGetDbscan() {
	yield takeLatest(dataTypeKeys.GET_DBSCAN, getDbscanAsync);
}

function* getDbscanAsync(action: GetDbscanAction) {
	try {
		const { data } = yield call(
			axios.post,
			calcApi.getDbscan,
			action.payload
		);
		yield put(typesafeAction(dataTypeKeys.GET_DBSCAN_SUCCEEDED, data));
	} catch (error) {
		yield put(
			typesafeAction(dataTypeKeys.GET_DBSCAN_FAILED, error.response.data)
		);
	}
}

function* handlePopulatePointsFromLocalStorageIfAvailable() {
	try {
		const points = localStorage.getItem(localStorageKeys.points);
		if (points !== null) {
			yield put(
				typesafeAction(
					dataTypeKeys.POPULATE_POINTS_STATE_FROM_LOCAL_STORAGE_IF_AVAILABLE_SUCCEEDED,
					JSON.parse(points)
				)
			);
		}
	} catch (error) {
		console.error(error);
	}
}

function* watchHandlePopulatePointsFromLocalStorageIfAvailable() {
	yield takeLatest(
		dataTypeKeys.POPULATE_POINTS_STATE_FROM_LOCAL_STORAGE_IF_AVAILABLE,
		handlePopulatePointsFromLocalStorageIfAvailable
	);
}

function* handleGetPointsGroupsAsync() {
	try {
		const { data } = yield call(axios.get, pointsApi.getPoints);
		yield put(
			typesafeAction(dataTypeKeys.GET_POINTS_GROUPS_SUCCEEDED, data)
		);
	} catch (error) {
		console.error(error);
	}
}

function* watchHandleGetPointsGroupsAsync() {
	yield takeLatest(
		dataTypeKeys.GET_POINTS_GROUPS,
		handleGetPointsGroupsAsync
	);
}

export const sagas = [
	watchCreatePointsGroup,
	watchGetAhcs,
	watchGetDbscan,
	watchHandlePopulatePointsFromLocalStorageIfAvailable,
	watchHandleGetPointsGroupsAsync
];
