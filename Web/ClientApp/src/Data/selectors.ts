import { IDataState } from './reducer';

interface IExpectedReduxState {
	data: IDataState;
}

export const getActivePointsGroup = (state: IExpectedReduxState) =>
	state.data.pointsGroups.find(pg => pg.isActive)!;
