import axios from 'axios';
import { action as typesafeAction } from 'typesafe-actions';
import { takeLatest, put, call } from 'redux-saga/effects';
import {
	dataTypeKeys,
	GetMapDataAction,
	GetAgglomerativeHierarchicalClustersAction
} from './actions';
import { fileApi, localStorageKeys, formHeaders, calcApi } from './constants';

export function* watchGetMapData() {
	yield takeLatest(dataTypeKeys.GET_DATA, getMapDataAsync);
}

function* getMapDataAsync(action: GetMapDataAction) {
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

export function* watchGetAgglomerativeHierarchicalClusters() {
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
