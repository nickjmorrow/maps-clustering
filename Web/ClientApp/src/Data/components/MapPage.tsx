import {
	colors,
	IOption,
	Select,
	Typography,
	borderRadius,
	border,
	transitions
} from 'njm-react-component-library';
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { IReduxState } from 'src/reducer';
import { getColors as getMarkerColors } from 'src/services';
import styled from 'styled-components';
import {
	Clusters,
	Map,
	Parameters,
	savePointsGroup,
	deletePointsGroup,
	setActivePointsGroup
} from '../';
import { clusterOptions, clusterTypes } from '../constants';
import {
	getAgglomerativeHierarchicalClustersFromState,
	getPoints
} from '../selectors';
import {
	AgglomerativeHierarchicalClusterPoint,
	ClusteredPoint,
	IClusterOption,
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

	handleClusterTypeChange = (currentClusterOption: IClusterOption) =>
		this.setState({ currentClusterOption });

	// TODO
	handlePointsChange = (option: IOption) => alert('hey');

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
		const { points, pointsGroups } = this.props;
		const {
			currentClusterOption,
			clusterCount: clusterCount,
			markerColors
		} = this.state;

		const markers = getMarkers(
			getPointsForMap(this.state, this.props),
			clusterCount,
			markerColors,
			currentClusterOption
		);

		const activePointsGroup = this.props.pointsGroups.find(
			pg => pg.isActive
		)!;
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
						<Typography variant="h2">Points</Typography>

						{pointsGroups.map(this.renderPointsGroup)}
						<Typography variant="h2">Cluster Type</Typography>
						<Select
							options={clusterOptions}
							onChange={this.handleClusterTypeChange}
							currentOption={currentClusterOption}
							removeNoneOptionAfterSelection={true}
						/>
						<Parameters
							currentClusterOption={currentClusterOption}
							points={points}
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
								this.props
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
			onSetActivePointsGroup: setActivePointsGroup
		},
		dispatch
	);

export const MapPage = connect(
	mapStateToProps,
	mapDispatchToProps
)(MapPageInternal);

// types
const initialState = {
	clusterCount: 30,
	currentClusterOption: null as IOption | null,
	markerColors: [] as string[]
};

type IState = typeof initialState;

interface IDispatchProps {
	onSavePointsGroup(pointsGroup: IPointsGroup): void;
	onDeletePointsGroup(pointsGroupId: number): void;
	onSetActivePointsGroup(pointsGroupId: number | undefined): void;
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
	currentClusterOption: IOption | null,
	clusterCount: number,
	props: IProps
): ClusteredPoint[] => {
	const unclusteredPoints = props.points.map(p => ({
		...p,
		clusterId: p.pointId
	}));
	if (!currentClusterOption) {
		return unclusteredPoints;
	}
	switch (currentClusterOption.value) {
		case clusterTypes.agglomerativeHierarchicalClusters:
			return props.agglomerativeHierarchicalClusters.map(ahc => {
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
	state: IState,
	props: IProps
): IPoint[] | AgglomerativeHierarchicalClusterPoint[] => {
	const { currentClusterOption } = state;
	const { agglomerativeHierarchicalClusters, pointsGroups } = props;
	const activePointsGroup = pointsGroups.find(pg => pg.isActive)!;
	if (!activePointsGroup) {
		return [];
	}
	const { points } = activePointsGroup;
	if (currentClusterOption === null) {
		return points;
	}
	const canShowAgglomerativeHierarchicalClusters =
		props.agglomerativeHierarchicalClusters.length > 0;
	switch (currentClusterOption.value) {
		case clusterTypes.agglomerativeHierarchicalClusters:
			return canShowAgglomerativeHierarchicalClusters
				? agglomerativeHierarchicalClusters
				: points;
		default:
			return points;
	}
};
const getFillColorFunc = (
	currentClusterOption: IOption | null,
	markerColors: string[],
	value: number
) => {
	const defaultFillColorFunc = (
		p: IPoint | AgglomerativeHierarchicalClusterPoint
	) => 'red';
	if (!currentClusterOption || markerColors.length === 0) {
		return defaultFillColorFunc;
	}
	switch (currentClusterOption.value) {
		case clusterTypes.agglomerativeHierarchicalClusters:
			return (p: AgglomerativeHierarchicalClusterPoint) =>
				markerColors[
					p.agglomerativeHierarchicalClusterInfos[value - 1].clusterId
				];
		default:
			return defaultFillColorFunc;
	}
};
const getMarkers = (
	modeledPoints: IPoint[],
	value: number,
	markerColors: string[],
	currentClusterOption: IOption | null
) => {
	if (!modeledPoints.length) {
		return [];
	}
	return modeledPoints.map(mp => ({
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
				value
			)(mp)
		}
	}));
};
