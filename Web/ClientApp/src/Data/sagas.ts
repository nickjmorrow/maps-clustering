import axios from 'axios';
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import {
	createPointsGroup,
	dataTypeKeys,
	deletePointsGroup,
	getPointsGroups,
	populatePointsGroupsStateFromLocalStorageIfAvailable,
	savePointsGroupIfStoredLocally,
	addPointsGroup
} from './actions';
import { formHeaders, localStorageKeys, pointsGroupApi } from './constants';
import { IPointsGroup } from './types';
import { getFromLocalStorage } from 'njm-react-component-library/lib/Core/services';

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
		const file = action.payload;
		const { data } = yield call(
			axios.post,
			pointsGroupApi.createPointsGroup,
			file,
			formHeaders
		);

		const pointsGroup: IPointsGroup = {
			...data,
			pointsGroupId: undefined
		};

		yield put(createPointsGroup.success(pointsGroup));

		localStorage.setItem(
			localStorageKeys.pointsGroup,
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
		const file = action.payload;
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
		const pointsGroup = localStorage.getItem(localStorageKeys.pointsGroup);
		if (pointsGroup !== null) {
			yield put(
				populatePointsGroupsStateFromLocalStorageIfAvailable.success(
					JSON.parse(pointsGroup)
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
	action: ReturnType<typeof savePointsGroupIfStoredLocally.request>
) {
	try {
		const pointsGroups = getFromLocalStorage(localStorageKeys.pointsGroup);
		if (pointsGroups) {
			const { data } = yield call(
				axios.post,
				pointsGroupApi.savePointsGroup,
				pointsGroups[0]
			);
			if (data) {
				localStorage.removeItem(localStorageKeys.pointsGroup);
			}
			yield put(savePointsGroupIfStoredLocally.success(data));
		}
	} catch (error) {
		console.error(error);
	}
}

function* watchSavePointsGroup() {
	yield takeLatest(
		dataTypeKeys.SAVE_POINTS_GROUP_IF_STORED_LOCALLY,
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
