import { all, fork } from "redux-saga/effects";
import { authSagas } from "./Auth/auth-helpers/sagas";
import { dataSagas } from "./Data";
import { coreSagas } from "./Core";

// TODO
// import { authSagas } from '@nickjmorrow/react-component-library';

const allSagas = [...authSagas, ...dataSagas, ...coreSagas];

export function* rootSaga() {
	yield all(allSagas.map(s => fork(s)));
}
