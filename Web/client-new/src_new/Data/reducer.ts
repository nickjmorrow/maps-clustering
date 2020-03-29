import produce from "immer";
import { IOption } from "@nickjmorrow/react-component-library";
import { ActionType } from "typesafe-actions";
import { getColors, ItemPermissionType } from "../Core";
import * as actions from "./actions";
import { dataTypeKeys } from "./actions";
import { clusterTypes } from "./constants";
import { IPointsGroup } from "./types";
import { css } from 'react-select/lib/components/SingleValue';

export interface IDataState {
	readonly error: string;
	readonly pointsGroups: IPointsGroup[];
	readonly currentClusterOption: IOption;
}

export const initialState: IDataState = {
	pointsGroups: [],
	error: "",
	currentClusterOption: {
		label: "Agglomerative Hierarchical Clustering",
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
				draftState.pointsGroups = ensureActivePointsGroup(
					pointsGroups.map(withColors)
				);
			});
		case dataTypeKeys.CREATE_POINTS_GROUP_FAILED:
			return { ...state, error: action.payload };
		case dataTypeKeys.ADD_POINTS_GROUP_SUCCEEDED:
			return {
				...state,
				pointsGroups: ensureActivePointsGroup(
					[
						{ ...action.payload, isActive: true },
						...state.pointsGroups.map(asInactive)
					].map(withColors)
				)
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
			return {
				...state,
				pointsGroups: state.pointsGroups.map(
					setActivePointsGroup(action.payload)
				)
			};
		case dataTypeKeys.REMOVE_SAVED_AND_PRIVATE_POINTS_GROUPS:
			return {
				...state,
				pointsGroups: state.pointsGroups
					.filter(
						pg =>
							!pg.pointsGroupId ||
							pg.itemPermissionType === ItemPermissionType.Public
					)
					.map(withFirstPointsGroupActive)
			};
		case dataTypeKeys.SET_CLUSTER_COUNT:
			const { pointsGroupId, clusterCount } = action.payload;
			return {
				...state,
				pointsGroups: state.pointsGroups.map(pg =>
					pg.pointsGroupId === pointsGroupId
						? { ...pg, clusterCount }
						: pg
				)
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
	return pointsGroupsWithActive.map(pg => {
		if (!pg.clusterCount) {
			pg.clusterCount = pg.calculationOutput.orderedPoints.length;
		}
		return pg;
	});
};

const defaultsAreLastAndDefaultsAreFirst = (pg: IPointsGroup) =>
	pg.itemPermissionType === ItemPermissionType.Public
		? -1
		: pg.pointsGroupId === undefined
		? 1
		: 0;

const withColors = (pg: IPointsGroup): IPointsGroup => ({
	...pg,
	pointsColors: pg.pointsColors || getColors(pg.calculationOutput.orderedPoints.length)
});

const withOrderId = (pg: IPointsGroup) : IPointsGroup => ({
	...pg,
	calculationOutput: {
		...pg.calculationOutput,
		orderedPoints: pg.calculationOutput.orderedPoints.map(cp => ({
			...cp, 
			clusterSnapshots: cp.clusterSnapshots.map(cs => ({
				...cs, orderId: cs.clusterId
			}))
		}))
	}
})

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

const asInactive = (pointsGroup: IPointsGroup): IPointsGroup => ({
	...pointsGroup,
	isActive: false
});

const replaceUnsavedPointsGroup = (newPointsGroup: IPointsGroup) => (
	pg: IPointsGroup
) => (pg.pointsGroupId ? pg : newPointsGroup);
