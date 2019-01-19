import axios from 'axios';
import { action as typesafeAction } from 'typesafe-actions';
import { takeLatest, put, call, all } from 'redux-saga/effects';
import {
	dataTypeKeys,
	ICreatePointsGroupAction,
	GetAhcAction,
	GetDbscanAction,
	ISavePointsGroupAction
} from './actions';
import {
	fileApi,
	localStorageKeys,
	formHeaders,
	calcApi,
	pointsApi,
	pointsGroupApi
} from './constants';
import { IPointsGroup } from './types';

function* watchCreatePointsGroup() {
	yield takeLatest(dataTypeKeys.CREATE_POINTS_GROUP, createPointsGroupAsync);
}

function* createPointsGroupAsync(action: ICreatePointsGroupAction) {
	try {
		const { name, formData } = action.payload;

		const { data } = yield call(
			axios.post,
			fileApi.upload,
			formData,
			formHeaders
		);

		const pointsGroup: IPointsGroup = {
			points: data,
			name
		};

		yield put(
			typesafeAction(
				dataTypeKeys.CREATE_POINTS_GROUP_SUCCEEDED,
				pointsGroup
			)
		);
		localStorage.setItem(localStorageKeys.points, JSON.stringify(data));
		localStorage.setItem(
			localStorageKeys.pointsGroups,
			JSON.stringify([pointsGroup])
		);
	} catch (error) {
		yield put(
			typesafeAction(dataTypeKeys.GET_MAP_POINTS, error.response.data)
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
		const actions = [];
		if (points !== null) {
			actions.push(
				put(
					typesafeAction(
						dataTypeKeys.POPULATE_POINTS_STATE_FROM_LOCAL_STORAGE_IF_AVAILABLE_SUCCEEDED,
						JSON.parse(points)
					)
				)
			);
		}
		const pointsGroups = localStorage.getItem(
			localStorageKeys.pointsGroups
		);
		if (pointsGroups !== null) {
			actions.push(
				put(
					typesafeAction(
						dataTypeKeys.POPULATE_POINTS_GROUPS_STATE_FROM_LOCAL_STORAGE_IF_AVAILABLE_SUCCEEDED,
						JSON.parse(pointsGroups!)
					)
				)
			);
		}
		yield all(actions);
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
		const { data } = yield call(axios.get, pointsApi.getPointsGroups);
		yield put(
			typesafeAction(dataTypeKeys.GET_POINTS_GROUPS_SUCCEEDED, data)
		);
	} catch (error) {
		console.error(error);
	}
}

function* watchGetPointsGroups() {
	yield takeLatest(
		dataTypeKeys.GET_POINTS_GROUPS,
		handleGetPointsGroupsAsync
	);
}

function* handleSavePointsGroupAsync(action: ISavePointsGroupAction) {
	try {
		const { data } = yield call(
			axios.post,
			pointsGroupApi.savePointsGroup,
			action.payload
		);
		localStorage.removeItem(localStorageKeys.pointsGroups);
		yield put(
			typesafeAction(dataTypeKeys.SAVE_POINTS_GROUP_SUCCEEDED, data)
		);
	} catch (error) {
		console.error(error);
	}
}

function* watchSavePointsGroup() {
	yield takeLatest(
		dataTypeKeys.SAVE_POINTS_GROUP,
		handleSavePointsGroupAsync
	);
}

export const sagas = [
	watchCreatePointsGroup,
	watchGetAhcs,
	watchGetDbscan,
	watchHandlePopulatePointsFromLocalStorageIfAvailable,
	watchGetPointsGroups,
	watchSavePointsGroup
];
