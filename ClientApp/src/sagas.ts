import { all } from 'redux-saga/effects';
import {
	watchGetMapData,
	watchGetAgglomerativeHierarchicalClusters
} from './Data';

export function* rootSaga() {
	yield all([watchGetMapData(), watchGetAgglomerativeHierarchicalClusters()]);
}
