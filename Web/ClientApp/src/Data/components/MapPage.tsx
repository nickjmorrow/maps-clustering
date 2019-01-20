import {
	border,
	borderRadius,
	colors,
	IOption,
	LabeledRadioButtonInput,
	transitions,
	Typography
} from 'njm-react-component-library';
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { IReduxState } from 'src/reducer';
import { getColors as getMarkerColors, googleMapURL } from '../../Core';
import styled from 'styled-components';
import {
	Clusters,
	deletePointsGroup,
	Map,
	Parameters,
	savePointsGroup,
	setActivePointsGroup,
	getAhcs
} from '../';
import { clusterOptions, clusterTypes } from '../constants';
import {
	getAgglomerativeHierarchicalClustersFromState,
	getPoints
} from '../selectors';
import {
	AgglomerativeHierarchicalClusterPoint,
	ClusteredPoint,
	IPoint,
	IPointsGroup
} from '../types';

export class MapPageInternal extends React.Component<IProps, IState> {
	readonly state = initialState;

	componentWillReceiveProps = (nextProps: IProps) => {
		const activePointsGroup = nextProps.pointsGroups.find(
			pg => pg.isActive
		)!;
		if (!activePointsGroup) {
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

	savePointsGroup = (pointsGroup: IPointsGroup) =>
		this.props.onSavePointsGroup(pointsGroup);

	renderPointsGroup = (pg: IPointsGroup) => (
		<PointsGroupWrapper
			key={pg.pointsGroupId}
			onClick={() => this.props.onSetActivePointsGroup(pg.pointsGroupId)}>
			<Typography>{pg.name}</Typography>
			{!pg.pointsGroupId && (
				<button onClick={() => this.savePointsGroup(pg)}>Save</button>
			)}
			{pg.pointsGroupId && (
				<SmallCloseIcon
					onClick={() =>
						this.props.onDeletePointsGroup(pg.pointsGroupId!)
					}>
					Delete
				</SmallCloseIcon>
			)}
		</PointsGroupWrapper>
	);

	render() {
		const { pointsGroups, onGetAhcs } = this.props;
		const {
			currentClusterOption,
			clusterCount: clusterCount,
			markerColors
		} = this.state;

		const activePointsGroup = pointsGroups.find(pg => pg.isActive)!;

		const pointsForMap = getPointsForMap(
			currentClusterOption,
			activePointsGroup
		);

		const markers = getMarkers(
			pointsForMap,
			clusterCount,
			markerColors,
			currentClusterOption,
			activePointsGroup
		);

		const defaultPosition = activePointsGroup && {
			lat: activePointsGroup.averageVerticalDisplacement,
			lng: activePointsGroup.averageHorizontalDisplacement
		};

		return (
			<div>
				<Map
					markers={markers}
					defaultPosition={defaultPosition}
					googleMapUrl={googleMapURL}
				/>
				<Divider />
				<MapControls>
					<InfoPanel>
						<Typography variant="h1">Parameters</Typography>
						<Typography variant="h2">Points</Typography>
						{pointsGroups.map(this.renderPointsGroup)}
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
					</InfoPanel>
					<InfoPanel>
						<Typography variant="h1">Results</Typography>
						<Typography variant="h2">Clusters</Typography>
						<Clusters
							clusteredPoints={getClusters(
								currentClusterOption,
								clusterCount,
								activePointsGroup,
								onGetAhcs
							)}
						/>
					</InfoPanel>
				</MapControls>
			</div>
		);
	}
}

// redux
const mapStateToProps = (state: IReduxState): IReduxProps => ({
	points: getPoints(state),
	agglomerativeHierarchicalClusters: getAgglomerativeHierarchicalClustersFromState(
		state
	),
	pointsGroups: state.data.pointsGroups
});

const mapDispatchToProps = (dispatch: Dispatch): IDispatchProps =>
	bindActionCreators(
		{
			onSavePointsGroup: savePointsGroup.request,
			onDeletePointsGroup: deletePointsGroup.request,
			onSetActivePointsGroup: setActivePointsGroup,
			onGetAhcs: getAhcs.request
		},
		dispatch
	);

export const MapPage = connect(
	mapStateToProps,
	mapDispatchToProps
)(MapPageInternal);

// types
const initialState = {
	clusterCount: 1,
	currentClusterOption: clusterOptions[0],
	markerColors: [] as string[]
};

type IState = typeof initialState;

interface IDispatchProps {
	onSavePointsGroup(pointsGroup: IPointsGroup): void;
	onDeletePointsGroup(pointsGroupId: number): void;
	onSetActivePointsGroup(pointsGroupId: number | undefined): void;
	onGetAhcs(pointsGroup: IPointsGroup): void;
}

interface IReduxProps {
	points: IPoint[];
	agglomerativeHierarchicalClusters: AgglomerativeHierarchicalClusterPoint[];
	pointsGroups: IPointsGroup[];
}

type IProps = IReduxProps & IDispatchProps;

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

const PointsGroupWrapper = styled.div`
	padding: 4px;
	border-radius: ${borderRadius.default};
	border: 1px solid transparent;
	width: min-content;
	cursor: pointer;
	&: hover {
		border: ${border.default};
		transition: ${transitions.fast};
	}
`;

const SmallCloseIcon = styled.button``;

// helpers
const getClusters = (
	currentClusterOption: IOption,
	clusterCount: number,
	activePointsGroup: IPointsGroup,
	onGetAhcs: (pointsGroup: IPointsGroup) => void
): ClusteredPoint[] => {
	if (!activePointsGroup) {
		return [];
	}
	const unclusteredPoints = activePointsGroup.points.map(p => ({
		...p,
		clusterId: p.pointId
	}));

	if (currentClusterOption.value === clusterTypes.none) {
		return unclusteredPoints;
	}

	switch (currentClusterOption.value) {
		case clusterTypes.ahcs:
			// if clusterInfo is not present, request for it and return
			// unclustered points
			if (activePointsGroup.ahcInfo === undefined) {
				onGetAhcs(activePointsGroup);
				return unclusteredPoints;
			}

			return activePointsGroup.ahcInfo.map(ahc => {
				return {
					...ahc,
					clusterId:
						ahc.agglomerativeHierarchicalClusterInfos[
							clusterCount - 1
						].clusterId
				};
			});
		default:
			return unclusteredPoints;
	}
};

const getPointsForMap = (
	currentClusterOption: IOption,
	activePointsGroup: IPointsGroup
): IPoint[] | AgglomerativeHierarchicalClusterPoint[] => {
	if (!activePointsGroup) {
		return [];
	}
	const { points } = activePointsGroup;
	if (!activePointsGroup.ahcInfo) {
		return points;
	}
	const canShowAgglomerativeHierarchicalClusters =
		activePointsGroup.ahcInfo![0].agglomerativeHierarchicalClusterInfos
			.length > 0;
	switch (currentClusterOption.value) {
		case clusterTypes.ahcs:
			return canShowAgglomerativeHierarchicalClusters
				? activePointsGroup.ahcInfo!
				: points;
		default:
			return points;
	}
};
const getFillColorFunc = (
	currentClusterOption: IOption | null,
	markerColors: string[],
	value: number,
	activePointsGroup: IPointsGroup
) => {
	const defaultFillColorFunc = (
		p: IPoint | AgglomerativeHierarchicalClusterPoint
	) => 'red';
	if (!currentClusterOption || markerColors.length === 0) {
		return defaultFillColorFunc;
	}
	switch (currentClusterOption.value) {
		case clusterTypes.ahcs:
			if (
				activePointsGroup.ahcInfo === undefined ||
				value >
					activePointsGroup.ahcInfo[0]
						.agglomerativeHierarchicalClusterInfos.length
			) {
				return defaultFillColorFunc;
			}
			return (p: AgglomerativeHierarchicalClusterPoint) =>
				markerColors[
					p.agglomerativeHierarchicalClusterInfos[value - 1].clusterId
				];
		default:
			return defaultFillColorFunc;
	}
};
const getMarkers = (
	pointsForMap: Array<AgglomerativeHierarchicalClusterPoint | IPoint>,
	value: number,
	markerColors: string[],
	currentClusterOption: IOption,
	activePointsGroup: IPointsGroup
) => {
	if (!activePointsGroup) {
		return [];
	}
	// const { points } = activePointsGroup;
	return pointsForMap.map(mp => ({
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
				activePointsGroup
			)(mp)
		}
	}));
};
