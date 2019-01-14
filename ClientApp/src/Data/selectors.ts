import { IReduxState } from 'src/reducer';
import { Point, AgglomerativeHierarchicalClusterPoint } from './types';

const getData = (state: IReduxState) => state.data;
export const getPoints = (state: IReduxState): Point[] => getData(state).points;

export const getAgglomerativeHierarchicalClustersFromState = (
	state: IReduxState
): AgglomerativeHierarchicalClusterPoint[] =>
	getData(state).agglomerativeHierarchicalClusters;
