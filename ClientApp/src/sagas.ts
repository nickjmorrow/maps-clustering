import { all } from 'redux-saga/effects';
import { watchGetMapData } from './Data';

export function* rootSaga() {
	yield all([watchGetMapData()]);
}
