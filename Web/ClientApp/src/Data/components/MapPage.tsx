import {
	colors,
	IOption,
	Select,
	Typography,
	Button
} from 'njm-react-component-library';
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { IReduxState } from 'src/reducer';
import { getColors as getMarkerColors } from 'src/services';
import styled from 'styled-components';
import { Clusters, Map, Parameters, savePointsGroup } from '../';
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

	componentWillReceiveProps = (nextProps: IProps) =>
		this.setState({
			markerColors: getMarkerColors(nextProps.points.length)
		});

	handleClusterCountChange = (clusterCount: number) =>
		this.setState({ clusterCount });

	handleClusterTypeChange = (currentClusterOption: IClusterOption) =>
		this.setState({ currentClusterOption });

	// TODO
	handlePointsChange = (option: IOption) => alert('hey');

	savePointsGroup = (pointsGroup: IPointsGroup) =>
		this.props.onSavePointsGroup(pointsGroup);

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

		return (
			<div>
				<Map markers={markers} />
				<Divider />
				<MapControls>
					<InfoPanel>
						<Typography variant="h1">Parameters</Typography>
						<Typography variant="h2">Points</Typography>

						{pointsGroups.map((pg, i) => (
							<div key={i}>
								<div>{pg.name}</div>
								{!pg.pointsGroupId ||
									(pg.pointsGroupId === 0 && (
										<Button
											onClick={() =>
												this.savePointsGroup(pg)
											}>
											Save
										</Button>
									))}
							</div>
						))}
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
			onSavePointsGroup: savePointsGroup.request
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
	const { agglomerativeHierarchicalClusters, points } = props;
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
