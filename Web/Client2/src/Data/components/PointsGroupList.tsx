import * as React from 'react';
import { IPointsGroup } from '../types';
import { PointsGroupButtonBar } from './PointsGroupButtonBar';
import { TitleWrapper } from '../../Core/components';
import { Header } from './Header';
import { StyledPointsGroupButtonBar } from 'Data/components/StyledPointsGroupButtonBar';
import { Typography } from '@nickjmorrow/react-component-library';

export const PointsGroupList: React.SFC<OwnProps> = ({ pointsGroups }) => {
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'flex-start',
			}}
		>
			<TitleWrapper>
				<Header>Points Groups</Header>
			</TitleWrapper>
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					flexDirection: 'column',
					width: '100%',
				}}
			>
				{pointsGroups.length === 0 ? (
					<StyledPointsGroupButtonBar isActive={false} isDisabled={true} />
				) : (
					pointsGroups.map(pg => <PointsGroupButtonBar key={pg.pointsGroupId || 0} pointsGroup={pg} />)
				)}
			</div>
		</div>
	);
};
// types
interface OwnProps {
	pointsGroups: IPointsGroup[];
}
