import { ReduxState } from 'src/reducer';
import { Point, AgglomerativeHierarchicalClusterPoint } from './types';

const getData = (state: ReduxState) => state.data;
export const getPoints = (state: ReduxState): Point[] => getData(state).points;

export const getAgglomerativeHierarchicalClustersFromState = (
	state: ReduxState
): AgglomerativeHierarchicalClusterPoint[] =>
	getData(state).agglomerativeHierarchicalClusters;
