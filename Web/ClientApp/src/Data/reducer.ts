import { getColors, ItemPermissionType } from '../Core';
import { ActionType } from 'typesafe-actions';
import * as actions from './actions';
import { dataTypeKeys } from './actions';
import { IPointsGroup } from './types';
import { clusterTypes } from './constants';
import { IOption } from 'njm-react-component-library';
import produce from 'immer';

export interface IDataState {
	readonly error: string;
	readonly pointsGroups: IPointsGroup[];
	readonly clusterCount: number;
	readonly currentClusterOption: IOption;
}

export const initialState: IDataState = {
	pointsGroups: [],
	error: '',
	clusterCount: 1,
	currentClusterOption: {
		label: 'Agglomerative Hierarchical Clustering',
		value: clusterTypes.ahcs
	}
};

export const dataReducer = (
	state: IDataState = initialState,
	action: ActionType<typeof actions>
): IDataState => {
	switch (action.type) {
		case dataTypeKeys.GET_POINTS_GROUPS_SUCCEEDED:
			return produce(state, draftState => {
				const combinedPointsGroups = [
					...state.pointsGroups,
					...action.payload
				];
				const pointsGroups = ensureActivePointsGroup(
					combinedPointsGroups.filter(removeDuplicatePointsGroups)
				).map(withColors);
				draftState.pointsGroups = pointsGroups;
			});
		case dataTypeKeys.POPULATE_POINTS_GROUPS_STATE_FROM_LOCAL_STORAGE_IF_AVAILABLE_SUCCEEDED:
		case dataTypeKeys.CREATE_POINTS_GROUP_SUCCEEDED:
			return produce(state, draftState => {
				const pointsGroups = state.pointsGroups
					.filter(toSavedPointsGroups)
					.map(asInactive);
				pointsGroups.unshift({ ...action.payload, isActive: true });
				draftState.pointsGroups = pointsGroups;
			});
		case dataTypeKeys.CREATE_POINTS_GROUP_FAILED:
			return { ...state, error: action.payload };
		case dataTypeKeys.ADD_POINTS_GROUP_SUCCEEDED:
			return {
				...state,
				pointsGroups: [
					{ ...action.payload, isActive: true },
					...state.pointsGroups.map(asInactive)
				].map(withColors)
			};
		case dataTypeKeys.SAVE_POINTS_GROUP_IF_STORED_LOCALLY_SUCCEEDED:
			return {
				...state,
				pointsGroups: ensureActivePointsGroup(
					state.pointsGroups
						.map(replaceUnsavedPointsGroup(action.payload))
						.map(withColors)
				)
			};
		case dataTypeKeys.DELETE_POINTS_GROUP_SUCCEEDED:
			return {
				...state,
				pointsGroups: ensureActivePointsGroup(
					state.pointsGroups.filter(
						pg => pg.pointsGroupId !== action.payload
					)
				)
			};
		case dataTypeKeys.SET_ACTIVE_POINTS_GROUP:
			const newPointsGroups = state.pointsGroups.map(
				setActivePointsGroup(action.payload)
			);
			const activePointsGroup = newPointsGroups.find(pg => pg.isActive)!;
			return {
				...state,
				pointsGroups: newPointsGroups,
				clusterCount: Math.min(
					activePointsGroup.ahcInfo.ahcPoints.length,
					state.clusterCount
				)
			};
		case dataTypeKeys.REMOVE_SAVED_AND_PRIVATE_POINTS_GROUPS:
			return {
				...state,
				pointsGroups: state.pointsGroups
					.filter(
						pg =>
							!pg.pointsGroupId ||
							pg.itemPermissionType === ItemPermissionType.Default
					)
					.map(withFirstPointsGroupActive)
			};
		case dataTypeKeys.SET_CLUSTER_COUNT:
			return {
				...state,
				clusterCount: action.payload
			};
		default:
			return state;
	}
};

const setActivePointsGroup = (pointsGroupId: number | undefined) => (
	pg: IPointsGroup
) =>
	pg.pointsGroupId === pointsGroupId
		? { ...pg, isActive: true }
		: { ...pg, isActive: false };

const withFirstPointsGroupActive = (
	pg: IPointsGroup,
	i: number
): IPointsGroup =>
	i === 0 ? { ...pg, isActive: true } : { ...pg, isActive: false };

const ensureActivePointsGroup = (pointsGroups: IPointsGroup[]) => {
	const hasActivePointsGroup =
		pointsGroups.filter(pg => pg.isActive).length > 0;
	const pointsGroupsWithActive = hasActivePointsGroup
		? pointsGroups.sort(defaultsAreLastAndDefaultsAreFirst)
		: pointsGroups
				.sort(defaultsAreLastAndDefaultsAreFirst)
				.map(withFirstPointsGroupActive);
	return pointsGroupsWithActive;
};

const defaultsAreLastAndDefaultsAreFirst = (pg: IPointsGroup) =>
	pg.itemPermissionType === ItemPermissionType.Default
		? -1
		: pg.pointsGroupId === undefined
		? 1
		: 0;

const withColors = (pg: IPointsGroup): IPointsGroup => ({
	...pg,
	pointsColors: pg.pointsColors || getColors(pg.points.length)
});

const removeDuplicatePointsGroups = (
	pointsGroup: IPointsGroup,
	index: number,
	pointsGroups: IPointsGroup[]
) =>
	pointsGroups
		.map(pg => pg.pointsGroupId)
		.indexOf(pointsGroup.pointsGroupId) === index;

const toSavedPointsGroups = (pointsGroup: IPointsGroup) =>
	pointsGroup.pointsGroupId !== undefined;

const asInactive = (pointsGroup: IPointsGroup) => ({
	...pointsGroup,
	isActive: false
});

const replaceUnsavedPointsGroup = (newPointsGroup: IPointsGroup) => (
	pg: IPointsGroup
) => (pg.pointsGroupId ? pg : newPointsGroup);
