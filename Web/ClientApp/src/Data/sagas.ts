import axios from 'axios';
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import {
	createPointsGroup,
	dataTypeKeys,
	deletePointsGroup,
	getPointsGroups,
	populatePointsGroupsStateFromLocalStorageIfAvailable,
	savePointsGroup,
	addPointsGroup
} from './actions';
import { formHeaders, localStorageKeys, pointsGroupApi } from './constants';
import { IPointsGroup } from './types';

function* handleGetPointsGroupsAsync() {
	try {
		const { data } = yield call(axios.get, pointsGroupApi.getPointsGroups);
		yield put(getPointsGroups.success(data));
	} catch (error) {
		console.error(error);
	}
}

function* watchGetPointsGroups() {
	yield takeEvery(dataTypeKeys.GET_POINTS_GROUPS, handleGetPointsGroupsAsync);
}

function* createPointsGroupAsync(
	action: ReturnType<typeof createPointsGroup.request>
) {
	try {
		const { name, file } = action.payload;
		const { data } = yield call(
			axios.post,
			pointsGroupApi.createPointsGroup,
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

function* watchCreatePointsGroup() {
	yield takeLatest(dataTypeKeys.CREATE_POINTS_GROUP, createPointsGroupAsync);
}

function* addPointsGroupAsync(
	action: ReturnType<typeof addPointsGroup.request>
) {
	try {
		const { file } = action.payload;
		const { data } = yield call(
			axios.post,
			pointsGroupApi.addPointsGroup,
			file,
			formHeaders
		);
		yield put(addPointsGroup.success(data));
	} catch (error) {
		yield put(addPointsGroup.failure(error));
	}
}

function* watchAddPointsGroup() {
	yield takeLatest(dataTypeKeys.ADD_POINTS_GROUP, addPointsGroupAsync);
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

function* handleSavePointsGroupAsync(
	action: ReturnType<typeof savePointsGroup.request>
) {
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

function* handleDeletePointsGroupAsync(
	action: ReturnType<typeof deletePointsGroup.request>
) {
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
	watchGetPointsGroups,
	watchAddPointsGroup,
	watchCreatePointsGroup,
	watchSavePointsGroup,
	watchDeletePointsGroup,
	watchPopulatePointsGroupsFromLocalStorageIfAvailable
];
