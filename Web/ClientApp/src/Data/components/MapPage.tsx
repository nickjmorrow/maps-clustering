import {
	colors,
	IOption,
	LabeledRadioButtonInput,
	Typography
} from 'njm-react-component-library';
import * as React from 'react';
import { connect } from 'react-redux';
import { IReduxState } from 'src/reducer';
import styled from 'styled-components';
import { Clusters, Map, Parameters } from '../';
import { getColors as getMarkerColors } from '../../Core';
import { clusterOptions, clusterTypes } from '../constants';
import {
	AgglomerativeHierarchicalClusterPoint,
	IPoint,
	IPointsGroup
} from '../types';
import { PointsGroupList } from './PointsGroupList';
import { getActivePointsGroup } from '../selectors';
import { FileUploadForm } from './FileUploadForm';

export class MapPageInternal extends React.Component<IProps, IState> {
	readonly state = initialState;

	componentWillReceiveProps = (nextProps: IProps) => {
		const activePointsGroup = nextProps.activePointsGroup;
		if (!activePointsGroup || !activePointsGroup.points) {
			this.setState({ markerColors: [] });
			return;
		}

		this.setState({
			markerColors: getMarkerColors(activePointsGroup.points.length)
		});
	};

	handleClusterCountChange = (clusterCount: number) =>
		this.setState({ clusterCount });

	handleClusterTypeChange = (currentClusterOption: IOption) => {
		this.setState({ currentClusterOption });
	};

	render() {
		const { pointsGroups, activePointsGroup } = this.props;
		const {
			currentClusterOption,
			clusterCount: clusterCount,
			markerColors
		} = this.state;

		const markers = getMarkers(
			activePointsGroup,
			clusterCount,
			markerColors,
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
						<Typography variant="h2">Cluster Type</Typography>
						<LabeledRadioButtonInput
							options={clusterOptions}
							onClick={this.handleClusterTypeChange}
							selectedOption={currentClusterOption}
						/>
						<Parameters
							currentClusterOption={currentClusterOption}
							clusterCount={clusterCount}
							onClusterCountChange={this.handleClusterCountChange}
						/>
						<FileUploadForm />
					</InfoPanel>
					<InfoPanel>
						<Typography variant="h1">Results</Typography>
						<Typography variant="h2">Clusters</Typography>
						<Clusters
							activePointsGroup={activePointsGroup}
							currentClusterOption={currentClusterOption}
							clusterCount={clusterCount}
							markerColors={markerColors}
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
	activePointsGroup: getActivePointsGroup(state)
});

export const MapPage = connect(
	mapStateToProps,
	null
)(MapPageInternal);

// types
const initialState = {
	clusterCount: 1,
	currentClusterOption: clusterOptions[0],
	markerColors: [] as string[]
};

type IState = typeof initialState;

interface IReduxProps {
	pointsGroups: IPointsGroup[];
	activePointsGroup: IPointsGroup;
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
	value: number,
	pointsForMap: IPoint[]
) => {
	switch (currentClusterOption.value) {
		case clusterTypes.ahcs:
			const ahcPoints = pointsForMap as AgglomerativeHierarchicalClusterPoint[];
			const canUseAhcs =
				ahcPoints[0].agglomerativeHierarchicalClusterInfos;
			const ahcFillColorFunc = (
				p: AgglomerativeHierarchicalClusterPoint
			) =>
				markerColors[
					p.agglomerativeHierarchicalClusterInfos[value - 1].clusterId
				];
			return canUseAhcs ? ahcFillColorFunc : defaultFillColorFunc;
		default:
			return defaultFillColorFunc;
	}
};
const getMarkers = (
	activePointsGroup: IPointsGroup,
	value: number,
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
						value,
						pointsForMap
					)(mp as AgglomerativeHierarchicalClusterPoint & IPoint)
				}
		  }))
		: [];
};
