import { Typography } from 'njm-react-component-library';
import * as React from 'react';
import { IPointsGroup } from '../types';
import { PointsGroup } from './PointsGroup';

export const PointsGroupList: React.SFC<IOwnProps> = ({ pointsGroups }) => {
	return (
		<div>
			<Typography variant="h2">Point Groups</Typography>
			{pointsGroups.map(pg => (
				<PointsGroup key={pg.pointsGroupId} pointsGroup={pg} />
			))}
		</div>
	);
};
// types
interface IOwnProps {
	pointsGroups: IPointsGroup[];
}
