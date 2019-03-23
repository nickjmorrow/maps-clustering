import {
	dataReducer,
	initialState as initialReduxState,
	IDataState
} from "../reducer";
import { ItemPermissionType } from "../../Core";
import { IPointsGroup, IPoint, ClusteringOutput } from "../types";
import {
	deletePointsGroup,
	getPointsGroups,
	addPointsGroup,
	createPointsGroup,
	populatePointsGroupsStateFromLocalStorageIfAvailable,
	savePointsGroupIfStoredLocally
} from "../actions";
import produce from "immer";

const getFakePointsGroup = (id: number): IPointsGroup => ({
	pointsGroupId: id,
	name: `PG ${id}`,
	averageHorizontalDisplacement: id,
	averageVerticalDisplacement: id,
	points: (null as unknown) as IPoint[],
	pointsColors: [""],
	isActive: false,
	clusteringOutput: (null as unknown) as ClusteringOutput,
	itemPermissionType: ItemPermissionType.Private,
	clusterCount: id
});

describe("data reducer", () => {
	const genericInitialTestState: IDataState = {
		...initialReduxState,
		pointsGroups: [1, 2, 3].map(getFakePointsGroup)
	};
	test("delete points group", () => {
		const expectedState = produce(genericInitialTestState, draftState => {
			const pointsGroups = [2, 3].map(getFakePointsGroup);
			pointsGroups[0].isActive = true;
			draftState.pointsGroups = pointsGroups;
		});
		expect(
			dataReducer(genericInitialTestState, deletePointsGroup.success(1))
		).toEqual(expectedState);
	});

	test("delete active points group", () => {
		const initialState = produce(genericInitialTestState, draftState => {
			const pointsGroups = [1, 2, 3].map(getFakePointsGroup);
			pointsGroups[1].isActive = true;
			draftState.pointsGroups = pointsGroups;
		});
		const expectedState = produce(initialState, draftState => {
			const pointsGroups = [1, 3].map(getFakePointsGroup);
			pointsGroups[0].isActive = true;
			draftState.pointsGroups = pointsGroups;
		});
		expect(dataReducer(initialState, deletePointsGroup.success(2))).toEqual(
			expectedState
		);
	});

	test("get points group removes duplicates", () => {
		const initialState = produce(genericInitialTestState, draftState => {
			const pointsGroups = [1, 2].map(getFakePointsGroup);
			pointsGroups[1].isActive = true;
			draftState.pointsGroups = pointsGroups;
		});
		const payload = [2, 3].map(getFakePointsGroup);
		const expectedState = produce(initialState, draftState => {
			const pointsGroups = [1, 2, 3].map(getFakePointsGroup);
			pointsGroups[1].isActive = true;
			draftState.pointsGroups = pointsGroups;
		});
		expect(
			dataReducer(initialState, getPointsGroups.success(payload))
		).toEqual(expectedState);
	});

	test("add points group sets payload as isActive and rest of pointsGroups as inactive", () => {
		const initialState = produce(genericInitialTestState, draftState => {
			const pointsGroups = [1, 2].map(getFakePointsGroup);
			pointsGroups[1].isActive = true;
			draftState.pointsGroups = pointsGroups;
		});
		const payload = getFakePointsGroup(3);
		const expectedState = produce(initialState, draftState => {
			draftState.pointsGroups = [3, 1, 2].map(getFakePointsGroup);
			draftState.pointsGroups[0].isActive = true;
		});
		expect(
			dataReducer(initialState, addPointsGroup.success(payload))
		).toEqual(expectedState);
	});

	test("create points group and populate points groups from local storage removes unsaved pointsGroups and adds to beginning of array of pointsGroups", () => {
		const initialState = produce(genericInitialTestState, draftState => {
			const pointsGroups = [1, 2, 3].map(getFakePointsGroup);
			pointsGroups[0].pointsGroupId = undefined;
			draftState.pointsGroups = pointsGroups;
		});
		const payload = { ...getFakePointsGroup(99), pointsGroupId: undefined };
		const expectedState = produce(initialState, draftState => {
			const pointsGroups = [2, 3].map(getFakePointsGroup);
			pointsGroups.unshift({ ...payload, isActive: true });
			draftState.pointsGroups = pointsGroups;
		});
		expect(
			dataReducer(initialState, createPointsGroup.success(payload))
		).toEqual(expectedState);
		expect(
			dataReducer(
				initialState,
				populatePointsGroupsStateFromLocalStorageIfAvailable.success(
					payload
				)
			)
		).toEqual(expectedState);
	});

	test("replace unsaved points group", () => {
		const initialState = produce(genericInitialTestState, draftState => {
			const pointsGroups = [1, 2].map(getFakePointsGroup);
			pointsGroups[0].pointsGroupId = undefined;
			draftState.pointsGroups = pointsGroups;
		});
		const payload = getFakePointsGroup(99);
		const expectedState = produce(initialState, draftState => {
			const pointsGroups = [99, 2].map(getFakePointsGroup);
			pointsGroups[0].isActive = true;
			draftState.pointsGroups = pointsGroups;
		});
		expect(
			dataReducer(
				initialState,
				savePointsGroupIfStoredLocally.success(payload)
			)
		).toEqual(expectedState);
	});
});
