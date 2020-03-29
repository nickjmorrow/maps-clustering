import * as React from 'react';
import { useSelector } from 'react-redux';
import { IReduxState } from 'reducer';
import { Paper } from './Paper';
import { Parameters } from './Parameters';
import { PointsGroupList } from './PointsGroupList';
import { pointsGroupsSelector } from '../selectors';

export const PointsGroupControls: React.FC = () => {
	const pointsGroups = useSelector((state: IReduxState) => pointsGroupsSelector(state));
	return (
		<div
			style={{
				width: '100%',
				display: 'flex',
				justifyContent: 'center',
			}}
		>
			<Paper
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					width: 'min-content',
				}}
			>
				<PointsGroupList pointsGroups={pointsGroups} />
				<Parameters />
			</Paper>
		</div>
	);
};
