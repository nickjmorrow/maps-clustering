import { all } from 'redux-saga/effects';
import { sagas as dataSagas } from './Data';
import { sagas as authSagas } from './Auth';
import { sagas as userSagas } from './User';

const allSagas = [...dataSagas, ...authSagas, ...userSagas];

export function* rootSaga() {
	yield all([allSagas.map(d => d())]);
}
