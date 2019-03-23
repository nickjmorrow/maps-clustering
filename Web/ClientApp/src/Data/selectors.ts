import { IDataState } from "./reducer";

interface IExpectedReduxState {
	data: IDataState;
}

// TODO: reselect
export const getPointsGroups = (state: IExpectedReduxState) =>
	state.data.pointsGroups;
export const getActivePointsGroup = (state: IExpectedReduxState) =>
	state.data.pointsGroups.find(pg => pg.isActive)!;

export const getCurrentClusterOption = (state: IExpectedReduxState) =>
	state.data.currentClusterOption;
