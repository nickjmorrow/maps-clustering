import { dataReducer, initialState, IDataState } from '../reducer';
import { ItemPermissionType } from '../../Core';
import { IAhcInfo, IPointsGroup } from '../types';
import { deletePointsGroup } from '../actions';
import produce from 'immer';

const getFakePointsGroup = (id: number): IPointsGroup => ({
	pointsGroupId: id,
	name: `PG ${id}`,
	averageHorizontalDisplacement: id,
	averageVerticalDisplacement: id,
	points: [],
	pointsColors: [],
	isActive: false,
	ahcInfo: (null as unknown) as IAhcInfo,
	dateCreated: new Date(2019, id, id),
	itemPermissionType: ItemPermissionType.Private
});

describe('data reducer', () => {
	const initialTestState: IDataState = {
		...initialState,
		pointsGroups: [1, 2, 3].map(getFakePointsGroup)
	};
	test('delete points group', () => {
		const expectedState = produce(initialTestState, draftState => {
			const pointsGroups = [2, 3].map(getFakePointsGroup);
			pointsGroups[0].isActive = true;
			draftState.pointsGroups = pointsGroups;
		});
		expect(
			dataReducer(initialTestState, deletePointsGroup.success(1))
		).toEqual(expectedState);
	});
});
