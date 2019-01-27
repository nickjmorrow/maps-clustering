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

export const MapPageInternal: React.SFC<IReduxProps> = ({
	pointsGroups,
	activePointsGroup,
	clusterCount,
	currentClusterOption
}) => {
	if (!activePointsGroup) {
		return null;
	}
	const { pointsColors } = activePointsGroup;

	const markers = getMarkers(activePointsGroup, clusterCount, pointsColors);

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
					<Clusters
						activePointsGroup={activePointsGroup}
						currentClusterOption={currentClusterOption}
					/>
				</InfoPanel>
			</MapControls>
		</div>
	);
};

// redux
const mapStateToProps = (state: IReduxState): IReduxProps => ({
	pointsGroups: state.data.pointsGroups,
	activePointsGroup: getActivePointsGroup(state),
	clusterCount: state.data.clusterCount,
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
	readonly clusterCount: number;
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

const getMarkers = (
	activePointsGroup: IPointsGroup,
	clusterCount: number,
	pointsColors: string[]
) => {
	return activePointsGroup.ahcInfo.ahcPoints.map(mp => ({
		position: {
			lat: mp.verticalDisplacement,
			lng: mp.horizontalDisplacement
		},
		label: {
			text: mp.name
		},
		icon: {
			fillColor: pointsColors[mp.clusterInfos[clusterCount - 1].clusterId]
		}
	}));
};
