import axios from 'axios';
import { call, put, takeLatest, takeEvery } from 'redux-saga/effects';
import {
	createPointsGroup,
	dataTypeKeys,
	deletePointsGroup,
	getAhcs,
	GetAhcsAction,
	getPointsGroups,
	ICreatePointsGroupAction,
	IDeletePointsGroupAction,
	ISavePointsGroupAction,
	populatePointsGroupsStateFromLocalStorageIfAvailable,
	savePointsGroup
} from './actions';
import {
	calcApi,
	fileApi,
	formHeaders,
	localStorageKeys,
	pointsApi,
	pointsGroupApi
} from './constants';
import { IPointsGroup } from './types';

function* watchCreatePointsGroup() {
	yield takeLatest(dataTypeKeys.CREATE_POINTS_GROUP, createPointsGroupAsync);
}

function* createPointsGroupAsync(action: ICreatePointsGroupAction) {
	try {
		const { name, file } = action.payload;
		const { data } = yield call(
			axios.post,
			fileApi.upload,
			file,
			formHeaders
		);

		const pointsGroup: IPointsGroup = {
			...data,
			name,
			pointsGroupId: undefined
		};

		yield put(createPointsGroup.success(pointsGroup));

		localStorage.setItem(
			localStorageKeys.pointsGroups,
			JSON.stringify([pointsGroup])
		);
	} catch (error) {
		yield put(createPointsGroup.failure(error));
	}
}

function* watchGetAhcs() {
	yield takeLatest(dataTypeKeys.GET_AHCS, handleGetAhcsAsync);
}

function* handleGetAhcsAsync(action: GetAhcsAction) {
	const { points } = action.payload;
	try {
		const { data } = yield call(
			axios.post,
			calcApi.getAgglomerativeHierarchicalClusters,
			points
		);
		const pointsGroup: IPointsGroup = {
			...action.payload,
			ahcInfo: {
				ahcPoints: data,
				clusterSummaryInfo: []
			}
		};
		yield put(getAhcs.success(pointsGroup));
	} catch (error) {
		yield put(getAhcs.failure(error));
	}
}

function* handlePopulatePointsGroupsFromLocalStorageIfAvailable() {
	try {
		const pointsGroups = localStorage.getItem(
			localStorageKeys.pointsGroups
		);
		if (pointsGroups !== null) {
			yield put(
				populatePointsGroupsStateFromLocalStorageIfAvailable.success(
					JSON.parse(pointsGroups)
				)
			);
		}
	} catch (error) {
		console.error(error);
	}
}

function* watchPopulatePointsGroupsFromLocalStorageIfAvailable() {
	yield takeEvery(
		dataTypeKeys.POPULATE_POINTS_GROUPS_STATE_FROM_LOCAL_STORAGE_IF_AVAILABLE,
		handlePopulatePointsGroupsFromLocalStorageIfAvailable
	);
}

function* handleGetPointsGroupsAsync() {
	try {
		const { data } = yield call(axios.get, pointsApi.getPointsGroups);
		yield put(getPointsGroups.success(data));
	} catch (error) {
		console.error(error);
	}
}

function* watchGetPointsGroups() {
	yield takeEvery(dataTypeKeys.GET_POINTS_GROUPS, handleGetPointsGroupsAsync);
}

function* handleSavePointsGroupAsync(action: ISavePointsGroupAction) {
	try {
		const { data } = yield call(
			axios.post,
			pointsGroupApi.savePointsGroup,
			action.payload
		);
		localStorage.removeItem(localStorageKeys.pointsGroups);
		yield put(savePointsGroup.success(data));
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

function* handleDeletePointsGroupAsync(action: IDeletePointsGroupAction) {
	try {
		const { data } = yield call(
			axios.delete,
			pointsGroupApi.deletePointsGroup(action.payload)
		);
		yield put(deletePointsGroup.success(data));
	} catch (error) {
		console.error(error);
	}
}

function* watchDeletePointsGroup() {
	yield takeLatest(
		dataTypeKeys.DELETE_POINTS_GROUP,
		handleDeletePointsGroupAsync
	);
}

export const dataSagas = [
	watchCreatePointsGroup,
	watchGetAhcs,
	watchPopulatePointsGroupsFromLocalStorageIfAvailable,
	watchGetPointsGroups,
	watchSavePointsGroup,
	watchDeletePointsGroup
];
