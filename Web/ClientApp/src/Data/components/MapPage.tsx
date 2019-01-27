import { colors, IOption, Typography } from 'njm-react-component-library';
import * as React from 'react';
import { connect } from 'react-redux';
import { IReduxState } from '../../reducer';
import styled from 'styled-components';
import { Clusters, Map, Parameters } from '../';
import { clusterOptions, clusterTypes } from '../constants';
import { getActivePointsGroup } from '../selectors';
import {
	AgglomerativeHierarchicalClusterPoint,
	IPoint,
	IPointsGroup
} from '../types';
import { FileUploadForm } from './FileUploadForm';
import { PointsGroupList } from './PointsGroupList';

export class MapPageInternal extends React.Component<IProps, IState> {
	readonly state = initialState;

	handleClusterTypeChange = (currentClusterOption: IOption) => {
		this.setState({ currentClusterOption });
	};

	render() {
		const {
			pointsGroups,
			activePointsGroup,
			clusterCount,
			currentClusterOption
		} = this.props;

		if (!activePointsGroup) {
			return null;
		}
		const { pointsColors } = activePointsGroup;

		const markers = getMarkers(
			activePointsGroup,
			clusterCount,
			pointsColors,
			currentClusterOption
		);

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
						<Parameters
							currentClusterOption={currentClusterOption}
						/>
						<FileUploadForm />
					</InfoPanel>
					<InfoPanel>
						<Typography variant="h1">Results</Typography>
						<Typography variant="h2">Clusters</Typography>
						<Clusters
							activePointsGroup={activePointsGroup}
							currentClusterOption={currentClusterOption}
						/>
					</InfoPanel>
				</MapControls>
			</div>
		);
	}
}

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
const initialState = {
	currentClusterOption: clusterOptions[0]
};

type IState = typeof initialState;

interface IReduxProps {
	pointsGroups: IPointsGroup[];
	activePointsGroup: IPointsGroup;
	clusterCount: number;
	currentClusterOption: IOption;
}

type IProps = IReduxProps;

// css
const InfoPanel = styled.div`
	margin: 0px 16px;
	min-width: 300px;
	min-height: 300px;
`;

const MapControls = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
`;

const Divider = styled.div`
	height: 20px;
	background-color: ${colors.darkGray};
`;

// helpers

const getPointsForMap = (
	currentClusterOption: IOption,
	activePointsGroup: IPointsGroup
) => {
	if (!activePointsGroup) {
		return [];
	}
	const { points } = activePointsGroup;
	const canShowAhcs =
		activePointsGroup.ahcInfo &&
		activePointsGroup.ahcInfo!.ahcPoints &&
		activePointsGroup.ahcInfo!.ahcPoints.length > 0;

	switch (currentClusterOption.value) {
		case clusterTypes.ahcs:
			return canShowAhcs ? activePointsGroup.ahcInfo!.ahcPoints : points;
		default:
			return points;
	}
};

const defaultFillColorFunc = (
	p: IPoint | AgglomerativeHierarchicalClusterPoint
) => 'red';

const getFillColorFunc = (
	currentClusterOption: IOption,
	markerColors: string[],
	clusterCount: number,
	pointsForMap: IPoint[]
) => {
	switch (currentClusterOption.value) {
		case clusterTypes.ahcs:
			const ahcPoints = pointsForMap as AgglomerativeHierarchicalClusterPoint[];
			const canUseAhcs = ahcPoints[0].clusterInfos;
			const ahcFillColorFunc = (
				p: AgglomerativeHierarchicalClusterPoint
			) => markerColors[p.clusterInfos[clusterCount - 1].clusterId];
			return canUseAhcs ? ahcFillColorFunc : defaultFillColorFunc;
		default:
			return defaultFillColorFunc;
	}
};
const getMarkers = (
	activePointsGroup: IPointsGroup,
	clusterCount: number,
	markerColors: string[],
	currentClusterOption: IOption
) => {
	const pointsForMap = getPointsForMap(
		currentClusterOption,
		activePointsGroup
	);

	return pointsForMap
		? pointsForMap.map(mp => ({
				position: {
					lat: mp.verticalDisplacement,
					lng: mp.horizontalDisplacement
				},
				label: {
					text: mp.name
				},
				icon: {
					fillColor: getFillColorFunc(
						currentClusterOption,
						markerColors,
						clusterCount,
						pointsForMap
					)(mp as AgglomerativeHierarchicalClusterPoint & IPoint)
				}
		  }))
		: [];
};
