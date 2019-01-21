import { all, fork } from 'redux-saga/effects';
import { authSagas } from './Auth/sagas';
import { dataSagas } from './Data';

const allSagas = [...authSagas, ...dataSagas];

export function* rootSaga() {
	yield all(allSagas.map(s => fork(s)));
}
