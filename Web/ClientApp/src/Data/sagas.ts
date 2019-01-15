import axios from 'axios';
import { action as typesafeAction } from 'typesafe-actions';
import { takeLatest, put, call } from 'redux-saga/effects';
import {
	dataTypeKeys,
	GetMapPointsAction,
	GetAgglomerativeHierarchicalClustersAction,
	GetDbscanAction
} from './actions';
import { fileApi, localStorageKeys, formHeaders, calcApi } from './constants';

function* watchGetMapData() {
	yield takeLatest(dataTypeKeys.GET_DATA, getMapDataAsync);
}

function* getMapDataAsync(action: GetMapPointsAction) {
	try {
		const { data } = yield call(
			axios.post,
			fileApi.upload,
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

function* watchGetAgglomerativeHierarchicalClusters() {
	yield takeLatest(
		dataTypeKeys.GET_AGGLOMERATIVE_HIERARCHICAL_CLUSTERS,
		getAgglomerativeHierarchicalClustersAsync
	);
}

function* getAgglomerativeHierarchicalClustersAsync(
	action: GetAgglomerativeHierarchicalClustersAction
) {
	try {
		const { data } = yield call(
			axios.post,
			calcApi.getAgglomerativeHierarchicalClusters,
			action.payload
		);
		yield put(
			typesafeAction(
				dataTypeKeys.GET_AGGLOMERATIVE_HIERARCHICAL_CLUSTERS_SUCCEEDED,
				data
			)
		);
	} catch (error) {
		yield put(
			typesafeAction(
				dataTypeKeys.GET_AGGLOMERATIVE_HIERARCHICAL_CLUSTERS_FAILED,
				error.response.data
			)
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

export const sagas = [
	watchGetMapData,
	watchGetAgglomerativeHierarchicalClusters,
	watchGetDbscan
];
