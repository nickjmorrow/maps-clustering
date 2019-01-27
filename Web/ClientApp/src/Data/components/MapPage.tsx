import { colors, IOption, Typography } from 'njm-react-component-library';
import * as React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Clusters, Map, Parameters } from '../';
import { FileUploadForm } from '../../Core/components';
import { IReduxState } from '../../reducer';
import { getActivePointsGroup } from '../selectors';
import { IPointsGroup } from '../types';
import { PointsGroupList } from './PointsGroupList';
import { Summary } from './Summary';

export const MapPageInternal: React.SFC<IReduxProps> = ({
	pointsGroups,
	activePointsGroup,
	currentClusterOption
}) => {
	if (!activePointsGroup) {
		return null;
	}

	const markers = getMarkers(activePointsGroup);

	const defaultPosition = activePointsGroup && {
		lat: activePointsGroup.averageVerticalDisplacement,
		lng: activePointsGroup.averageHorizontalDisplacement
	};

	return (
		<div>
			<Map markers={markers} defaultPosition={defaultPosition} />
			<Divider />
			<MapControls>
				<InfoPanel>
					<Typography variant="h1">Parameters</Typography>
					<PointsGroupList pointsGroups={pointsGroups} />
					<Parameters currentClusterOption={currentClusterOption} />
					<FileUploadForm />
				</InfoPanel>
				<InfoPanel>
					<Typography variant="h1">Results</Typography>
					<FlexRow>
						<Clusters activePointsGroup={activePointsGroup} />
						<Summary />
					</FlexRow>
				</InfoPanel>
			</MapControls>
		</div>
	);
};

// redux
const mapStateToProps = (state: IReduxState): IReduxProps => ({
	pointsGroups: state.data.pointsGroups,
	activePointsGroup: getActivePointsGroup(state),
	currentClusterOption: state.data.currentClusterOption
});

export const MapPage = connect(
	mapStateToProps,
	null
)(MapPageInternal);

// types
interface IReduxProps {
	readonly pointsGroups: IPointsGroup[];
	readonly activePointsGroup: IPointsGroup;
	readonly currentClusterOption: IOption;
}

// css
const InfoPanel = styled.div`
	margin: 0px 16px;
	min-width: 400px;
	min-height: 300px;
`;

const MapControls = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
	margin: 0px 20px;
`;

const Divider = styled.div`
	height: 20px;
	background-color: ${colors.darkGray};
`;

const FlexRow = styled.div`
	display: flex;
	flex-direction: row;
`;

// helpers
const getMarkers = (activePointsGroup: IPointsGroup) => {
	const { clusterCount, pointsColors, points } = activePointsGroup;
	return activePointsGroup.ahcInfo.ahcPoints.map(mp => ({
		position: {
			lat: mp.verticalDisplacement,
			lng: mp.horizontalDisplacement
		},
		label: {
			text: mp.name
		},
		icon: {
			fillColor:
				pointsColors[
					mp.clusterInfos[points.length - clusterCount].clusterId
				]
		}
	}));
};
