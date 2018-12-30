import { ReduxState } from 'src/reducer';
import { Point } from './types';

const getData = (state: ReduxState) => state.data;
export const getPoints = (state: ReduxState): Point[] => getData(state).points;
