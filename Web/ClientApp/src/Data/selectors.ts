import { IReduxState } from 'src/reducer';
import { IPoint, AgglomerativeHierarchicalClusterPoint } from './types';

const getData = (state: IReduxState) => state.data;
export const getPoints = (state: IReduxState): IPoint[] =>
	getData(state).points;

export const getAgglomerativeHierarchicalClustersFromState = (
	state: IReduxState
): AgglomerativeHierarchicalClusterPoint[] =>
	getData(state).agglomerativeHierarchicalClusters;
