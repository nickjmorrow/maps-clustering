import { StyleConstant, ThemeContext, Typography } from '@nickjmorrow/react-component-library';
import * as React from 'react';
import { GridLoader } from 'react-spinners';
import styled from 'styled-components';
import { Map } from '../';
import { IReduxState } from '../../reducer';
import { getActivePointsGroup } from '../selectors';
import { MapControls } from './MapControls';
import { useSelector } from 'react-redux';

export const MapPage: React.SFC = () => {
	const { colors } = React.useContext(ThemeContext);
	const pointsGroups = useSelector((state: IReduxState) => state.data.pointsGroups);
	const activePointsGroup = useSelector((state: IReduxState) => getActivePointsGroup(state));
	const currentClusterOption = useSelector((state: IReduxState) => state.data.currentClusterOption);

	return (
		<>
			{activePointsGroup ? (
				<Map activePointsGroup={activePointsGroup} />
			) : (
				<div
					style={{
						height: '580px',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						flexDirection: 'column',
					}}
				>
					<GridLoader />
					<Typography style={{ marginTop: '32px' }}>Loading clusters...</Typography>
				</div>
			)}
			<Divider colors={colors} />
			<MapControls
				pointsGroups={pointsGroups}
				activePointsGroup={activePointsGroup}
				currentClusterOption={currentClusterOption}
			/>
		</>
	);
};
// css
const Divider = styled('div')<{ colors: StyleConstant<'colors'> }>`
	height: 20px;
	background-color: ${p => p.colors.neutral.cs6};
`;
