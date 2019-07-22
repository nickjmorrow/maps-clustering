import { IDataState } from "./reducer";
import { createSelector } from "reselect";

interface IExpectedReduxState {
	data: IDataState;
}

// TODO: reselect
export const dataSelector = (state: IExpectedReduxState) => state.data;

export const pointsGroupsSelector = createSelector(
	[dataSelector],
	data => data.pointsGroups
);

export const getActivePointsGroup = createSelector(
	[pointsGroupsSelector],
	pointsGroups => pointsGroups.find(pg => pg.isActive)!
);
