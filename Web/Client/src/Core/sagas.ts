import axios from "axios";
import { coreApi } from "Core";
import { call, put, takeEvery } from "redux-saga/effects";
import { coreTypeKeys, getDatabaseSettings } from "./actions";
import { coreSessionStorageKeys } from "./constants";

function* handleGetDatabaseSettingsAsync() {
	try {
		const { data } = yield call(axios.get, coreApi.getDatabaseSettings);
		yield put(getDatabaseSettings.success(data));

		sessionStorage.setItem(
			coreSessionStorageKeys.databaseSettings,
			JSON.stringify(data)
		);
	} catch (error) {
		yield put(getDatabaseSettings.failure(error));
	}
}

function* watchGetDatabaseSettings() {
	yield takeEvery(
		coreTypeKeys.GET_DATABASE_SETTINGS,
		handleGetDatabaseSettingsAsync
	);
}

export const coreSagas = [watchGetDatabaseSettings];
