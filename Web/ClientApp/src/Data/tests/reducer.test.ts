import { dataReducer, initialState, IDataState } from '../reducer';
import { ItemPermissionType } from '../../Core';
import { IAhcInfo, IPointsGroup } from '../types';
import { deletePointsGroup } from '../actions';

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
	expect(dataReducer(initialTestState, deletePointsGroup.success(1))).toEqual(
		[2, 3].map(getFakePointsGroup)
	);
});
