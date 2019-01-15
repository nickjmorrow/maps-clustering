import { all } from 'redux-saga/effects';
import { sagas as dataSagas } from './Data';
import { sagas as authSagas } from './Auth';

const allSagas = [...dataSagas, ...authSagas];

export function* rootSaga() {
	yield all([allSagas.map(d => d())]);
}