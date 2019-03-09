import { all, fork } from "redux-saga/effects";
import { authSagas } from "./Auth/auth-helpers/sagas";
import { dataSagas } from "./Data";
// import { authSagas } from '@nickjmorrow/react-component-library';

const allSagas = [...authSagas, ...dataSagas];

export function* rootSaga() {
	yield all(allSagas.map(s => fork(s)));
}
