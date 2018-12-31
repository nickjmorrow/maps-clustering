import { all } from 'redux-saga/effects';
import { sagas as dataSagas } from './Data';

export function* rootSaga() {
	yield all([dataSagas.map(d => d())]);
}
